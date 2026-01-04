
export default function HealthScore({ score }) {
    let color = "text-green-800";
    let message = "Excellent financial health!";
  
    if (score < 40) {
      color = "text-red-500";
      message = "Critical spending behavior detected.";
    } else if (score < 70) {
      color = "text-purple-500";
      message = "You’re doing okay, but can improve.";
    }
  
    return (
      <div className="bg-yellow-300 shadow-xl p-4 rounded-xl text-center text-black">
        <h2 className="text-2xl mb-2"><b>Money Health Score</b></h2>
        <div className={`text-5xl font-bold ${color}`}>
          {score}
        </div>
        <p className="text-sm mt-2">{message}</p>
      </div>
    );
  }
  