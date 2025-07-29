import { useState } from "react";
import { Eye, Edit, Mail, Calendar, Clock, AlertCircle, CheckCircle2, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRequisitions, useUpdateRequisition, useDeleteRequisition } from "@/hooks/use-requisitions";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { RichTextViewer } from "@/components/rich-text-viewer";
import { RequisitionEditModal } from "@/components/requisition-edit-modal";
import type { ProjectRequisition } from "@shared/schema";

const priorityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
} as const;

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  "in-progress": "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
} as const;

interface RequisitionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requisition: ProjectRequisition;
}

function RequisitionDetailsModal({ isOpen, onClose, requisition }: RequisitionDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-hidden p-0 gap-0 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent text-white p-6">
          <DialogHeader>
            <DialogDescription className="text-white/80 text-base mb-2">
              Project requisition details for review and status management.
            </DialogDescription>
            <DialogTitle className="text-2xl font-bold text-white mb-3">
              {requisition.title}
            </DialogTitle>
            <div className="flex items-center space-x-4">
              <Badge 
                variant="secondary" 
                className={`${priorityColors[requisition.priority as keyof typeof priorityColors]} font-semibold`}
              >
                {requisition.priority.charAt(0).toUpperCase() + requisition.priority.slice(1)} Priority
              </Badge>
              <Badge 
                variant="secondary" 
                className={`${statusColors[requisition.status as keyof typeof statusColors]} font-semibold`}
              >
                {requisition.status.charAt(0).toUpperCase() + requisition.status.slice(1)}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-6">
            {/* Requester Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requester Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-20">Name:</span>
                    <span className="font-medium">{requisition.requesterName}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 w-16">Email:</span>
                    <a href={`mailto:${requisition.requesterEmail}`} className="text-blue-600 hover:underline">
                      {requisition.requesterEmail}
                    </a>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-20">Category:</span>
                    <span className="font-medium">{requisition.category}</span>
                  </div>
                  {requisition.expectedDelivery && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 w-16">Due:</span>
                      <span className="font-medium">{new Date(requisition.expectedDelivery).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 w-16">Created:</span>
                    <span className="font-medium">{new Date(requisition.createdAt!).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Description</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <RichTextViewer content={requisition.description} />
              </div>
            </div>

            {/* Deployed Link - Show for completed status */}
            {requisition.status === 'completed' && requisition.deployedLink && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Deployed Application</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <a
                    href={requisition.deployedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Deployed Application
                  </a>
                  <p className="text-sm text-green-600 mt-1">
                    {requisition.deployedLink}
                  </p>
                </div>
              </div>
            )}

            {/* Attachments */}
            {requisition.attachments && requisition.attachments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {requisition.attachments.map((filename, index) => (
                    <a
                      key={index}
                      href={`/api/files/${filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      <div className="flex-1 truncate">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                          {filename.split('-').slice(1).join('-') || filename}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RequisitionManagement() {
  const [selectedRequisition, setSelectedRequisition] = useState<ProjectRequisition | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRequisition, setEditingRequisition] = useState<ProjectRequisition | null>(null);
  
  const { toast } = useToast();
  const { data: requisitions, isLoading } = useRequisitions();
  const updateRequisition = useUpdateRequisition();
  const deleteRequisition = useDeleteRequisition();

  const handleViewDetails = (requisition: ProjectRequisition) => {
    setSelectedRequisition(requisition);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (requisition: ProjectRequisition) => {
    setEditingRequisition(requisition);
    setIsEditModalOpen(true);
  };

  const handleStatusChange = async (requisitionId: number, newStatus: string) => {
    try {
      await updateRequisition.mutateAsync({
        id: requisitionId,
        requisition: { status: newStatus as any }
      });
      toast({
        title: "Success",
        description: "Requisition status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update requisition status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (requisition: ProjectRequisition) => {
    try {
      await deleteRequisition.mutateAsync(requisition.id);
      toast({
        title: "Success",
        description: `Requisition "${requisition.title}" has been deleted`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete requisition",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Requisitions</h2>
          <p className="text-gray-600 mt-1">Review and manage submitted project requests</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Title</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Skeleton className="w-8 h-8" />
                      <Skeleton className="w-8 h-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : requisitions && requisitions.length > 0 ? (
              requisitions.map((requisition) => (
                <TableRow key={requisition.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-slate-800">{requisition.title}</div>
                      <div className="text-sm text-slate-500">{requisition.category}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-slate-800">{requisition.requesterName}</div>
                      <div className="text-sm text-slate-500">{requisition.requesterEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50">
                      {requisition.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[requisition.priority as keyof typeof priorityColors]}>
                      {requisition.priority.charAt(0).toUpperCase() + requisition.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={requisition.status}
                      onValueChange={(value) => handleStatusChange(requisition.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">
                      {new Date(requisition.createdAt!).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(requisition)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {requisition.deployedLink && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(requisition.deployedLink!, '_blank')}
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50"
                          title="View Deployed Application"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(requisition)}
                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50"
                        title="Edit Requisition"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Requisition</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{requisition.title}"? This action cannot be undone and will permanently remove the requisition.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(requisition)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={deleteRequisition.isPending}
                            >
                              {deleteRequisition.isPending ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <div className="text-slate-500">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 mb-2">No project requisitions yet</h3>
                    <p className="mb-4">Project requests will appear here when users submit them</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Modal */}
      {selectedRequisition && (
        <RequisitionDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          requisition={selectedRequisition}
        />
      )}

      {/* Edit Modal */}
      {editingRequisition && (
        <RequisitionEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          requisition={editingRequisition}
        />
      )}
    </div>
  );
}