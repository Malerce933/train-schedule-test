import TrainSchedule from "@/components/TrainSchedule";
import { getAllTrainsFromDB } from "@/lib/db";
import { getCurrentUser, verifyJwt } from "@/lib/jwt";
import { redirect } from "next/navigation";

export default async function SchedulePage() {

  const result = await verifyJwt();

  if (!result) {
    return redirect("/"); 
  }

  const user = await getCurrentUser(); 
  if(!user) {
    return redirect("/"); 
  }


  try {
    const trains = await getAllTrainsFromDB(user.id);
    return <TrainSchedule initialTrains={trains} user={user} />;

  } catch (error) {
    console.error("Error fetching train schedule:", error);
    return <div>Failed to load train schedule.</div>; 
  }
}
