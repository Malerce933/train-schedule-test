'use client';

import React from 'react';
import { Train } from '@/models/train';
import { deleteTrainAction } from '@/actions/save-action';

type TrainTableProps = {
  trains: Train[];
  setTrains: (trains: Train[]) => void;
  onEdit: (train: Train) => void;
  user: {
    id: string;
    email: string;
  } | null;
};

const tableColumns = ["#", "Номер", "Звідки", "Куди", "Відправлення", "Прибуття", "Дії"];

export default function TrainTable({user, trains, setTrains, onEdit }: TrainTableProps) {
    

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-lg font-semibold mb-4">Список поїздів</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {tableColumns.map((column, index) => (
                <th key={index} className="border-b px-4 py-2">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trains?.map((train, index) => (
              <tr key={train.id} className="hover:bg-gray-50 transition">
                <td className="border-b px-4 py-2 text-center">{index + 1}</td>
                <td className="border-b px-4 py-2">{train.train_number || '—'}</td>
                <td className="border-b px-4 py-2">{train.from_station}</td>
                <td className="border-b px-4 py-2">{train.to_station}</td>
                <td className="border-b px-4 py-2">{new Date(train.departure_time).toLocaleString('uk-UA')}</td>
                <td className="border-b px-4 py-2">{new Date(train.arrival_time).toLocaleString('uk-UA')}</td>
                <td className="border-b px-4 py-2 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => onEdit(train)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Редагувати
                    </button>
                    <form action={() => deleteTrainAction(train.id, user!.id)}>
                    <input type="hidden" name="userId" value={user?.id} />
                      <button
                        type="submit"
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Видалити
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {trains.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-4">
                  Немає записів
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
