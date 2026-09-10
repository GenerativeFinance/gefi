//! Bonawitz-style secure aggregation primitives (prototype).
//! Trusted cryptographic boundary for mask derivation and commitments.
//! Does not invent custom elliptic curves — uses HKDF-SHA256 + SHA-256.

use axum::{routing::post, Json, Router};
use hkdf::Hkdf;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use tower_http::cors::CorsLayer;

fn domain_hash(label: &str, parts: &[&[u8]]) -> String {
    let mut h = Sha256::new();
    h.update(b"gefi/v0/");
    h.update(label.as_bytes());
    for p in parts {
        h.update(p);
    }
    hex::encode(h.finalize())
}

fn derive_mask(seed: &[u8], round_id: &str, participant_a: &str, participant_b: &str, len: usize) -> Vec<u8> {
    let hk = Hkdf::<Sha256>::new(None, seed);
    let mut info = Vec::new();
    info.extend_from_slice(b"gefi/v0/secagg/mask/");
    info.extend_from_slice(round_id.as_bytes());
    // Canonical peer ordering
    let (x, y) = if participant_a <= participant_b {
        (participant_a, participant_b)
    } else {
        (participant_b, participant_a)
    };
    info.extend_from_slice(x.as_bytes());
    info.push(b'|');
    info.extend_from_slice(y.as_bytes());
    let mut out = vec![0u8; len];
    hk.expand(&info, &mut out).expect("hkdf expand");
    out
}

fn xor_inplace(dst: &mut [u8], src: &[u8]) {
    for (d, s) in dst.iter_mut().zip(src.iter()) {
        *d ^= *s;
    }
}

#[derive(Deserialize)]
struct MaskRequest {
    round_id: String,
    participant_id: String,
    peers: Vec<String>,
    seed_hex: String,
    update_bytes_hex: String,
}

#[derive(Serialize)]
struct MaskResponse {
    masked_update_hex: String,
    update_commitment: String,
}

async fn mask_update(Json(req): Json<MaskRequest>) -> Json<MaskResponse> {
    let seed = hex::decode(&req.seed_hex).unwrap_or_default();
    let mut update = hex::decode(&req.update_bytes_hex).unwrap_or_default();
    for peer in &req.peers {
        if peer == &req.participant_id {
            continue;
        }
        let mask = derive_mask(&seed, &req.round_id, &req.participant_id, peer, update.len());
        // Sign of mask depends on ordering (pairwise cancellation)
        if req.participant_id < *peer {
            xor_inplace(&mut update, &mask);
        } else {
            let flipped: Vec<u8> = mask.iter().map(|b| !*b).collect();
            // For prototype byte masks we XOR the same mask; production uses modular add/sub.
            xor_inplace(&mut update, &mask);
            let _ = flipped;
        }
    }
    let commitment = domain_hash("update", &[&update, req.participant_id.as_bytes()]);
    Json(MaskResponse {
        masked_update_hex: hex::encode(update),
        update_commitment: commitment,
    })
}

#[derive(Deserialize)]
struct AggregateRequest {
    round_id: String,
    model_version_hash: String,
    masked_updates_hex: Vec<String>,
    min_cohort_size: usize,
}

#[derive(Serialize)]
struct AggregateResponse {
    ok: bool,
    error: Option<String>,
    aggregate_commitment: Option<String>,
    cohort_size: usize,
}

async fn aggregate(Json(req): Json<AggregateRequest>) -> Json<AggregateResponse> {
    let cohort = req.masked_updates_hex.len();
    if cohort < req.min_cohort_size {
        return Json(AggregateResponse {
            ok: false,
            error: Some("cohort_too_small".into()),
            aggregate_commitment: None,
            cohort_size: cohort,
        });
    }
    let parts: Vec<Vec<u8>> = req
        .masked_updates_hex
        .iter()
        .filter_map(|h| hex::decode(h).ok())
        .collect();
    if parts.is_empty() {
        return Json(AggregateResponse {
            ok: false,
            error: Some("empty_updates".into()),
            aggregate_commitment: None,
            cohort_size: cohort,
        });
    }
    let len = parts[0].len();
    let mut acc = vec![0u8; len];
    for p in &parts {
        if p.len() != len {
            return Json(AggregateResponse {
                ok: false,
                error: Some("length_mismatch".into()),
                aggregate_commitment: None,
                cohort_size: cohort,
            });
        }
        xor_inplace(&mut acc, p);
    }
    let commitment = domain_hash(
        "aggregate",
        &[
            req.round_id.as_bytes(),
            req.model_version_hash.as_bytes(),
            &acc,
        ],
    );
    let _ = parts;
    Json(AggregateResponse {
        ok: true,
        error: None,
        aggregate_commitment: Some(commitment),
        cohort_size: cohort,
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/health", axum::routing::get(|| async { "ok" }))
        .route("/v1/secagg/mask", post(mask_update))
        .route("/v1/secagg/aggregate", post(aggregate))
        .layer(CorsLayer::permissive());

    let addr = std::env::var("SECAGG_BIND").unwrap_or_else(|_| "0.0.0.0:8091".into());
    let listener = tokio::net::TcpListener::bind(&addr).await.expect("bind");
    eprintln!("gefi-secagg listening on {addr}");
    axum::serve(listener, app).await.expect("serve");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn domain_hash_stable() {
        let a = domain_hash("update", &[b"abc"]);
        let b = domain_hash("update", &[b"abc"]);
        assert_eq!(a, b);
        assert_ne!(a, domain_hash("update", &[b"abd"]));
    }

    #[test]
    fn pairwise_mask_deterministic() {
        let seed = b"test-seed-32-bytes-padding!!!!!!";
        let m1 = derive_mask(seed, "r1", "a", "b", 16);
        let m2 = derive_mask(seed, "r1", "b", "a", 16);
        assert_eq!(m1, m2);
    }
}
