
import happy from "../assets/happycat.mp4"
import sad from "../assets/sadcat.mp4"
import normal from "../assets/normalcat.mp4"
import angry from "../assets/angrycat.mp4"


export default function MoodBit({ totalSpent, budget }) {
    let mood = "neutral";
    let emoji = <video src={normal} playsInline
    className="w-30 h-30 mx-auto" autoPlay loop/>;
    let message = "You're doing okay. Keep tracking!";
  
    if (!budget) {
      return (
        <div className="p-4 bg-slate-800 rounded text-white">
          <p>🐾 Set a budget to activate MoodBit</p>
        </div>
      );
    }
  
    const percent = totalSpent / budget;
  
    if (percent <= 0.4) {
      mood = "happy";
      emoji = <video src={happy} playsInline muted preload="auto"
      className="w-30 h-30 mx-auto" autoPlay loop/>;
      message = "Great job! Your spending is well under control.";
    } else if (percent <= 0.6) {
      mood = "neutral";
      emoji = <video src={normal} playsInline
      className="w-30 h-30 mx-auto" autoPlay loop/>;
      message = "You're doing fine. Just stay mindful.";
    } else if (percent <= 0.8) {
      mood = "sad";
      emoji = <video src={sad} playsInline
      className="w-30 h-30 mx-auto" autoPlay loop/>;
      message = "Careful! You're close to your budget limit.";
    } else if (percent <= 1) {
      mood = "angry";
      emoji = <video src={angry} playsInline
      className="w-30 h-30 mx-auto" autoPlay loop/>;
      message = "Overspending detected! MoodBit is upset.";
    }
  
    return (
      <div className="p-4 shadow-xl rounded-xl text-center text-blue-800" style={{backgroundColor: "#EAEAEC"}}>
        <div><h2 className="text-lg font-semibold">
          Your MoodBit: 
        </h2> </div>
        <div className="text-5xl">{emoji}</div>
        <p className="mt-2 font-semibold capitalize">{mood}</p>
        <p className="text-sm mt-1">{message}</p>
      </div>
    );
  }
  