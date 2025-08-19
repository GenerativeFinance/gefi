import React, { useState } from "react";
import { ethers } from "ethers";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { connectWallet, disconnectWallet, getWeb3Modal } from "../lib/web3";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Wallet, ExternalLink, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface OnchainPaymentModalProps {
  modelId: number;
  isOpen: boolean;
  onClose: () => void;
  modelName?: string;
  price?: number;
}

export default function OnchainPaymentModal({ 
  modelId, 
  isOpen, 
  onClose, 
  modelName = "AI Model", 
  price = 0.1 
}: OnchainPaymentModalProps) {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  async function createInvoice() {
    setLoading(true);
    try {
      const response = await apiRequest("POST", `/api/ai-models/${modelId}/onchain-invoice`, {});
      const data = await response.json();
      
      if (data?.success) {
        setInvoice(data);
        toast({ 
          title: "Invoice Created", 
          description: "Ready to proceed with payment" 
        });
      } else {
        toast({ 
          title: "Failed to create invoice", 
          description: data?.message || "Try again", 
          variant: "destructive" 
        });
      }
    } catch (e) {
      console.error(e);
      toast({ 
        title: "Error", 
        description: "Failed to create invoice", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }

  async function connectWalletHandler() {
    setLoading(true);
    try {
      const { address } = await connectWallet();
      setWalletConnected(true);
      setWalletAddress(address);
      toast({ 
        title: "Wallet Connected", 
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}` 
      });
    } catch (e: any) {
      console.error(e);
      toast({ 
        title: "Connection failed", 
        description: e?.message || "Failed to connect wallet", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }

  async function disconnectWalletHandler() {
    try {
      await disconnectWallet();
      setWalletConnected(false);
      setWalletAddress("");
      toast({ 
        title: "Wallet Disconnected", 
        description: "Successfully disconnected wallet" 
      });
    } catch (e: any) {
      console.error(e);
      toast({ 
        title: "Error", 
        description: "Failed to disconnect wallet", 
        variant: "destructive" 
      });
    }
  }

  async function payWithWallet() {
    if (!invoice) {
      toast({ 
        title: "Invoice missing", 
        description: "Create invoice first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { signer, address } = await connectWallet();
      
      // Send transaction
      const to = invoice.receiverAddress;
      const value = ethers.parseUnits(String(invoice.amountEth), "ether");
      const txResponse = await signer.sendTransaction({ to, value });
      
      toast({ 
        title: "Transaction submitted", 
        description: `TX: ${txResponse.hash.slice(0, 10)}...` 
      });

      // Submit to server for verification
      const verifyResponse = await apiRequest("POST", `/api/ai-models/${modelId}/verify-onchain`, {
        invoiceId: invoice.invoiceId,
        txHash: txResponse.hash,
      });
      
      const verifyData = await verifyResponse.json();
      
      if (verifyData?.success) {
        toast({ 
          title: "Subscribed", 
          description: "Subscription activated successfully!" 
        });
        queryClient.invalidateQueries({ queryKey: ["/api/ai-models/subscriptions"] });
        queryClient.invalidateQueries({ queryKey: ["/api/ai-models"] });
        onClose();
      } else {
        toast({ 
          title: "Verification pending", 
          description: verifyData?.message || "Payment verification in progress" 
        });
      }
    } catch (e: any) {
      console.error(e);
      toast({ 
        title: "Payment failed", 
        description: e?.message || "Try again", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Onchain Payment
          </DialogTitle>
          <DialogDescription>
            Subscribe to {modelName} using cryptocurrency
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Model Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{modelName}</CardTitle>
              <CardDescription>
                Monthly subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Price</span>
                <Badge variant="secondary">{price} ETH</Badge>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Wallet Connection */}
          {!walletConnected ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </CardTitle>
                <CardDescription>
                  Connect MetaMask or WalletConnect to proceed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={connectWalletHandler} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Wallet Connected
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Address</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </code>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={disconnectWalletHandler}
                  className="w-full"
                >
                  Disconnect
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payment Actions */}
          {walletConnected && (
            <div className="space-y-3">
              {!invoice ? (
                <Button 
                  onClick={createInvoice} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Invoice...
                    </>
                  ) : (
                    "Create Payment Invoice"
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={payWithWallet} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Pay {invoice.amountEth} ETH
                    </>
                  )}
                </Button>
              )}

              {invoice && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Receiver: {invoice.receiverAddress?.slice(0, 10)}...</p>
                  <p>Amount: {invoice.amountEth} ETH</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}