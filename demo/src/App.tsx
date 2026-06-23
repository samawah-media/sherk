/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { UserRole, Organization, Deliverable, FileAsset } from "./types";
import { mockClients, mockDeliverables, mockFiles, mockTeam } from "./data";
import { SwitcherControl } from "./components/SwitcherControl";
import { ClientWorkspace } from "./components/ClientWorkspace";
import { TeamWorkspace } from "./components/TeamWorkspace";
import { AdminWorkspace } from "./components/AdminWorkspace";
import { DeliverableDrawer } from "./components/DeliverableDrawer";
import { FileDrawer } from "./components/FileDrawer";
import { Info, HelpCircle } from "lucide-react";

export default function App() {
  // Overarching active view states
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.CLIENT);
  const [activeClient, setActiveClient] = useState<Organization>(mockClients[0]);

  // Master datastore lists (state-driven for full reactive simulations)
  const [deliverables, setDeliverables] = useState<Deliverable[]>(mockDeliverables);
  const [files, setFiles] = useState<FileAsset[]>(mockFiles);

  // Selected drawers states
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileAsset | null>(null);

  // Update handlers
  const handleUpdateDeliverables = (updatedList: Deliverable[]) => {
    setDeliverables(updatedList);
    
    // If a drawer is currently open, sync its state as well
    if (selectedDeliverable) {
      const match = updatedList.find(d => d.id === selectedDeliverable.id);
      if (match) {
        setSelectedDeliverable(match);
      }
    }
  };

  const handleUpdateFile = (updatedFile: FileAsset) => {
    const nextFiles = files.map(f => f.id === updatedFile.id ? updatedFile : f);
    setFiles(nextFiles);
    setSelectedFile(updatedFile);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans" dir="rtl">
      
      {/* Simulation Info Bar Header */}
      <div className="bg-gradient-to-l from-indigo-900 to-slate-900 text-indigo-100 py-2.5 px-4 md:px-6 text-xs font-bold flex items-center justify-between border-b border-indigo-950/40 relative z-50">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="leading-snug">
            هيكل محاكاة تفاعلي • استخدم شريط التحكم أدناه للتبديل الفوري بين الأطراف الثلاثة (العميل، فريق العمل، الإدارة) واستعرض كيف يتغير تدفق بيانات المخرجات وقياسات الـ SLA المخصصة فوراً!
          </span>
        </div>
      </div>

      {/* Role and Client selection switcher */}
      <SwitcherControl
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        activeClient={activeClient}
        onClientChange={(client) => setActiveClient(client)}
        clientsList={mockClients}
      />

      {/* Primary Workspace Panels Router */}
      <div className="flex-1 flex flex-col">
        {currentRole === UserRole.CLIENT && (
          <ClientWorkspace
            organization={activeClient}
            deliverables={deliverables}
            files={files}
            onOpenDeliverable={(del) => {
              setSelectedDeliverable(del);
              setSelectedFile(null);
            }}
            onOpenFile={(file) => {
              setSelectedFile(file);
              setSelectedDeliverable(null);
            }}
            onUpdateDeliverables={handleUpdateDeliverables}
          />
        )}

        {currentRole === UserRole.TEAM && (
          <TeamWorkspace
            activeClient={activeClient}
            deliverables={deliverables}
            files={files}
            teamMembers={mockTeam}
            onOpenDeliverable={(del) => {
              setSelectedDeliverable(del);
              setSelectedFile(null);
            }}
            onOpenFile={(file) => {
              setSelectedFile(file);
              setSelectedDeliverable(null);
            }}
            onUpdateDeliverables={handleUpdateDeliverables}
          />
        )}

        {currentRole === UserRole.ADMIN && (
          <AdminWorkspace
            clientsList={mockClients}
            deliverables={deliverables}
            files={files}
            teamMembers={mockTeam}
            onOpenDeliverable={(del) => {
              setSelectedDeliverable(del);
              setSelectedFile(null);
            }}
            onOpenFile={(file) => {
              setSelectedFile(file);
              setSelectedDeliverable(null);
            }}
            onUpdateDeliverables={handleUpdateDeliverables}
          />
        )}
      </div>

      {/* Floating Detailed Deliverable Drawer */}
      {selectedDeliverable && (
        <DeliverableDrawer
          isOpen={!!selectedDeliverable}
          deliverable={selectedDeliverable}
          onClose={() => setSelectedDeliverable(null)}
          role={currentRole}
          teamMembers={mockTeam}
          allFiles={files}
          onUpdateDeliverable={(updatedDel) => {
            const nextList = deliverables.map(d => d.id === updatedDel.id ? updatedDel : d);
            handleUpdateDeliverables(nextList);
          }}
        />
      )}

      {/* Floating Detailed File Drawer */}
      {selectedFile && (
        <FileDrawer
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onUpdateFile={handleUpdateFile}
          deliverables={deliverables}
        />
      )}

    </div>
  );
}
