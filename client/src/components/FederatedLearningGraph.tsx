import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Network, 
  Eye, 
  Filter, 
  Users, 
  Brain,
  Database,
  Shield,
  Coins,
  Activity,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";

interface Node {
  id: number;
  label: string;
  type: 'investor' | 'developer' | 'data_provider' | 'regulator';
  balance: string;
  earnings: string;
  accuracy?: string;
  status: 'active' | 'training' | 'idle';
  modelContributions: number;
  lastActivity: string;
}

interface Edge {
  from: number;
  to: number;
  label: string;
  type: 'model_update' | 'data_share' | 'contract' | 'reward';
  weight: number;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export default function FederatedLearningGraph() {
  const networkRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeDetailsOpen, setNodeDetailsOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [networkInstance, setNetworkInstance] = useState<any>(null);

  // Simulated federated learning network data
  const graphData: GraphData = {
    nodes: [
      {
        id: 1,
        label: "Guillaume L.",
        type: 'investor',
        balance: "1,250 GeFI",
        earnings: "8,450 GeFI",
        accuracy: "85.3%",
        status: 'active',
        modelContributions: 15,
        lastActivity: "2 minutes ago"
      },
      {
        id: 2,
        label: "AI Research Lab",
        type: 'developer',
        balance: "3,200 GeFI",
        earnings: "12,800 GeFI",
        accuracy: "91.2%",
        status: 'training',
        modelContributions: 28,
        lastActivity: "5 minutes ago"
      },
      {
        id: 3,
        label: "Market Data Inc",
        type: 'data_provider',
        balance: "2,800 GeFI",
        earnings: "15,600 GeFI",
        status: 'active',
        modelContributions: 22,
        lastActivity: "1 minute ago"
      },
      {
        id: 4,
        label: "SEC Compliance",
        type: 'regulator',
        balance: "500 GeFI",
        earnings: "2,100 GeFI",
        status: 'active',
        modelContributions: 8,
        lastActivity: "10 minutes ago"
      },
      {
        id: 5,
        label: "Quantum Hedge",
        type: 'investor',
        balance: "4,500 GeFI",
        earnings: "18,200 GeFI",
        accuracy: "88.7%",
        status: 'active',
        modelContributions: 31,
        lastActivity: "3 minutes ago"
      },
      {
        id: 6,
        label: "Neural Finance",
        type: 'developer',
        balance: "2,100 GeFI",
        earnings: "9,400 GeFI",
        accuracy: "83.9%",
        status: 'training',
        modelContributions: 19,
        lastActivity: "7 minutes ago"
      },
      {
        id: 7,
        label: "Bloomberg Terminal",
        type: 'data_provider',
        balance: "5,200 GeFI",
        earnings: "21,800 GeFI",
        status: 'active',
        modelContributions: 35,
        lastActivity: "30 seconds ago"
      },
      {
        id: 8,
        label: "Risk Analytics Co",
        type: 'developer',
        balance: "1,800 GeFI",
        earnings: "7,200 GeFI",
        accuracy: "79.5%",
        status: 'idle',
        modelContributions: 12,
        lastActivity: "2 hours ago"
      },
      {
        id: 9,
        label: "Crypto Whale",
        type: 'investor',
        balance: "6,700 GeFI",
        earnings: "25,300 GeFI",
        accuracy: "92.1%",
        status: 'active',
        modelContributions: 42,
        lastActivity: "1 minute ago"
      },
      {
        id: 10,
        label: "Fed Reserve",
        type: 'regulator',
        balance: "800 GeFI",
        earnings: "3,200 GeFI",
        status: 'active',
        modelContributions: 15,
        lastActivity: "15 minutes ago"
      },
      {
        id: 11,
        label: "DataStream Pro",
        type: 'data_provider',
        balance: "3,400 GeFI",
        earnings: "14,200 GeFI",
        status: 'training',
        modelContributions: 26,
        lastActivity: "4 minutes ago"
      },
      {
        id: 12,
        label: "Alpha Strategies",
        type: 'investor',
        balance: "2,900 GeFI",
        earnings: "11,700 GeFI",
        accuracy: "86.4%",
        status: 'active',
        modelContributions: 24,
        lastActivity: "6 minutes ago"
      }
    ],
    edges: [
      { from: 1, to: 2, label: "Model Update", type: 'model_update', weight: 10 },
      { from: 1, to: 3, label: "Data Request", type: 'data_share', weight: 5 },
      { from: 2, to: 5, label: "Collaboration", type: 'contract', weight: 15 },
      { from: 3, to: 7, label: "Data Sync", type: 'data_share', weight: 20 },
      { from: 4, to: 10, label: "Compliance", type: 'contract', weight: 8 },
      { from: 5, to: 9, label: "Investment Pool", type: 'contract', weight: 25 },
      { from: 6, to: 8, label: "Code Review", type: 'model_update', weight: 12 },
      { from: 7, to: 11, label: "Data Feed", type: 'data_share', weight: 18 },
      { from: 9, to: 12, label: "Strategy Share", type: 'model_update', weight: 22 },
      { from: 2, to: 6, label: "Model Training", type: 'model_update', weight: 16 },
      { from: 3, to: 11, label: "Market Data", type: 'data_share', weight: 14 },
      { from: 1, to: 5, label: "Reward Distribution", type: 'reward', weight: 30 },
      { from: 7, to: 9, label: "Premium Data", type: 'data_share', weight: 35 },
      { from: 4, to: 2, label: "Audit Request", type: 'contract', weight: 6 },
      { from: 12, to: 6, label: "Model License", type: 'contract', weight: 20 }
    ]
  };

  const getNodeColor = (node: Node) => {
    const baseColors = {
      investor: '#3B82F6',     // Blue
      developer: '#10B981',    // Green  
      data_provider: '#F59E0B', // Orange
      regulator: '#EF4444'     // Red
    };
    
    if (node.status === 'training') return '#8B5CF6'; // Purple for training
    if (node.status === 'idle') return '#6B7280';     // Gray for idle
    
    return baseColors[node.type];
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'investor': return <Coins className="h-4 w-4" />;
      case 'developer': return <Brain className="h-4 w-4" />;
      case 'data_provider': return <Database className="h-4 w-4" />;
      case 'regulator': return <Shield className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      training: 'bg-purple-100 text-purple-800',
      idle: 'bg-gray-100 text-gray-800'
    };
    return variants[status as keyof typeof variants] || variants.idle;
  };

  const filteredData = () => {
    let filteredNodes = graphData.nodes;
    
    if (filterType !== 'all') {
      filteredNodes = filteredNodes.filter(node => node.type === filterType);
    }
    
    if (filterStatus !== 'all') {
      filteredNodes = filteredNodes.filter(node => node.status === filterStatus);
    }
    
    const nodeIds = new Set(filteredNodes.map(node => node.id));
    const filteredEdges = graphData.edges.filter(edge => 
      nodeIds.has(edge.from) && nodeIds.has(edge.to)
    );
    
    return { nodes: filteredNodes, edges: filteredEdges };
  };

  const renderNetworkGraph = () => {
    if (!networkRef.current) return;

    const filtered = filteredData();
    
    // Create a simple canvas-based visualization
    const canvas = document.createElement('canvas');
    canvas.width = networkRef.current.clientWidth;
    canvas.height = 400;
    canvas.style.width = '100%';
    canvas.style.height = '400px';
    canvas.style.border = '1px solid #e5e7eb';
    canvas.style.borderRadius = '8px';
    canvas.style.background = '#f9fafb';
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear existing content
    networkRef.current.innerHTML = '';
    networkRef.current.appendChild(canvas);

    // Position nodes in a circle
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 80;
    
    const nodePositions = new Map();
    filtered.nodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / filtered.nodes.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      nodePositions.set(node.id, { x, y });
    });

    // Draw edges first
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    filtered.edges.forEach(edge => {
      const fromPos = nodePositions.get(edge.from);
      const toPos = nodePositions.get(edge.to);
      if (fromPos && toPos) {
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    filtered.nodes.forEach(node => {
      const pos = nodePositions.get(node.id);
      if (!pos) return;
      
      // Node circle
      ctx.fillStyle = getNodeColor(node);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
      ctx.fill();
      
      // Node border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Node label
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label.split(' ')[0], pos.x, pos.y + 35);
    });

    // Add click handler
    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;
      
      // Scale coordinates
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = clickX * scaleX;
      const y = clickY * scaleY;
      
      // Check if click is on a node
      filtered.nodes.forEach(node => {
        const pos = nodePositions.get(node.id);
        if (pos) {
          const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
          if (distance <= 20) {
            setSelectedNode(node);
            setNodeDetailsOpen(true);
          }
        }
      });
    });
  };

  useEffect(() => {
    renderNetworkGraph();
  }, [filterType, filterStatus]);

  useEffect(() => {
    const handleResize = () => {
      setTimeout(renderNetworkGraph, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            <CardTitle>Federated Learning Network</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="investor">Investors</SelectItem>
                <SelectItem value="developer">Developers</SelectItem>
                <SelectItem value="data_provider">Data Providers</SelectItem>
                <SelectItem value="regulator">Regulators</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span>Investors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span>Developers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span>Data Providers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span>Regulators</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span>Training</span>
            </div>
          </div>
          
          {/* Network Graph */}
          <div ref={networkRef} className="w-full h-96" />
          
          {/* Network Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold">{filteredData().nodes.length}</div>
              <div className="text-sm text-muted-foreground">Active Nodes</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold">{filteredData().edges.length}</div>
              <div className="text-sm text-muted-foreground">Connections</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold">87.2%</div>
              <div className="text-sm text-muted-foreground">Avg Accuracy</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold">142.3K</div>
              <div className="text-sm text-muted-foreground">Total GeFI</div>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Click on any node to view detailed information
          </div>
        </div>
        
        {/* Node Details Dialog */}
        <Dialog open={nodeDetailsOpen} onOpenChange={setNodeDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedNode && getNodeIcon(selectedNode.type)}
                {selectedNode?.label} Details
              </DialogTitle>
              <DialogDescription>
                Detailed information about this network participant
              </DialogDescription>
            </DialogHeader>
            {selectedNode && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getNodeIcon(selectedNode.type)}
                        {selectedNode.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusBadge(selectedNode.status)}>
                        {selectedNode.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Balance:</span>
                      <span className="font-medium text-green-600">{selectedNode.balance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Earnings:</span>
                      <span className="font-medium text-green-600">{selectedNode.earnings}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {selectedNode.accuracy && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model Accuracy:</span>
                        <span className="font-medium text-blue-600">{selectedNode.accuracy}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contributions:</span>
                      <span className="font-medium">{selectedNode.modelContributions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Activity:</span>
                      <span className="font-medium">{selectedNode.lastActivity}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Recent Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Model update submitted</span>
                      <span className="text-muted-foreground">{selectedNode.lastActivity}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Earned 10 GeFI reward</span>
                      <span className="text-muted-foreground">1 hour ago</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Joined training session</span>
                      <span className="text-muted-foreground">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}