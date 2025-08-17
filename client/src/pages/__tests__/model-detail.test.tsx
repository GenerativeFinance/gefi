import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ModelDetail from "../model-detail";

// Mock the apiRequest helper used by ModelDetail
const mockApiRequest = jest.fn();
jest.mock("@/lib/queryClient", () => ({
  apiRequest: mockApiRequest,
}));

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

describe("ModelDetail id param resolution & query enabling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // default mock returns ok response with JSON body
    // apiRequest(method, url, ...)
    mockApiRequest.mockImplementation(async (method: string, url: string) => {
      // return a Response-like object for most tests
      return {
        ok: true,
        status: 200,
        json: async () => ({ id: parseInt(String(url).split("/").pop() || "0", 10), name: "Test Model" }),
      };
    });
  });

  it("resolves id from /model/:id and calls the API", async () => {
    // set location to /model/5
    window.history.pushState({}, "Test", "/model/5");

    const qc = createQueryClient();
    render(
      <QueryClientProvider client={qc}>
        <ModelDetail />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(mockApiRequest).toHaveBeenCalledWith("GET", "/api/ai-models/5");
    });

    // basic smoke: model title rendered
    await waitFor(() => {
      expect(screen.getByText(/Test Model/i)).toBeInTheDocument();
    });
  });

  it("resolves id from /marketplace/:id and calls the API", async () => {
    window.history.pushState({}, "Test", "/marketplace/7");

    const qc = createQueryClient();
    render(
      <QueryClientProvider client={qc}>
        <ModelDetail />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(mockApiRequest).toHaveBeenCalledWith("GET", "/api/ai-models/7");
    });

    await waitFor(() => {
      expect(screen.getByText(/Test Model/i)).toBeInTheDocument();
    });
  });

  it("falls back to pathname parsing for /models/:id and calls the API", async () => {
    window.history.pushState({}, "Test", "/models/9?something=true");

    const qc = createQueryClient();
    render(
      <QueryClientProvider client={qc}>
        <ModelDetail />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(mockApiRequest).toHaveBeenCalledWith("GET", "/api/ai-models/9");
    });

    await waitFor(() => {
      expect(screen.getByText(/Test Model/i)).toBeInTheDocument();
    });
  });
});