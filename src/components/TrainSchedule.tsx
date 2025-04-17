'use client';

import { useState } from "react";
import { Train } from "@/models/train";
import TrainTable from "@/components/TrainTable";
import TrainForm from "@/components/TrainForm";
import LogoutButton from "./LogOut";

type TrainScheduleProps = {
  initialTrains: Train[];
  user: {
    id: string;
    email: string;
  } | null;
};

export default function TrainSchedule({ initialTrains, user }: TrainScheduleProps) {
  const [trains, setTrains] = useState<Train[]>(initialTrains);
  const [editTrain, setEditTrain] = useState<Train | null>(null);

  const handleEditClick = (train: Train) => {
    setEditTrain(train);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8 relative">
        {/* 👤 User info + Logout */}
        <div className="absolute top-0 right-0 mt-4 mr-4 flex items-center space-x-3 text-sm text-gray-600">
          {user && (
            <>
              <span>
                👤 <span className="font-medium">{user.email}</span>
              </span>
              <LogoutButton />
            </>
          )}
        </div>

        <header className="text-center mt-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Розклад поїздів</h1>
          <p className="text-gray-600">Додайте або редагуйте розклад залізничних перевезень</p>
        </header>

        <TrainTable user={user} trains={trains} setTrains={setTrains} onEdit={handleEditClick} />

        <TrainForm user={user} initialData={editTrain ?? undefined} isEditing={!!editTrain} />
      </div>
    </div>
  );
}
