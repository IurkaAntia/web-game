import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../../store/slices/authSlice"; // Import fetchUser action
import { fetchGames, selectGames } from "../../store/slices/gamesSlice"; // Import games-related actions and selector

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access user state
  const {
    user,
    error: userError,
    isAuthenticated,
  } = useSelector((state) => state.auth);

  // Access games state
  const {
    games,
    error: gamesError,
    loading: gamesLoading,
  } = useSelector(selectGames);

  // Fetch user and games data on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUser());
      dispatch(fetchGames());
    }
  }, [dispatch, isAuthenticated]);
   // Combined error message
   const errorMessage = userError || gamesError;

   // Loading state for games
   if (gamesLoading) {
     return (
       <div className="flex items-center justify-center min-h-screen bg-gray-100">
         <p className="text-lg font-medium text-gray-700">Loading games...</p>
       </div>
     );
   }

   // Main dashboard layout
   return (
     <div className="min-h-screen bg-gray-100">
       {/* Header Section */}
       <header className="bg-blue-600 text-white py-6 shadow-lg">
         <div className="container mx-auto px-4">
           <h1 className="text-3xl font-bold">Dashboard</h1>
           {user && (
             <p className="mt-2">
               Welcome, <span className="font-semibold">{user.name}</span>! You
               have <span className="font-semibold">{user.points}</span> points.
             </p>
           )}
         </div>
       </header>

       {/* Main Content Section */}
       <main className="container mx-auto px-4 py-8">
         {/* Error Message */}
         {errorMessage && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
             <p>{errorMessage}</p>
           </div>
         )}

         {/* Games Section */}
         <h2 className="text-2xl font-bold mb-6">Available Games</h2>
         {games.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {games.map((game) => (
               <div
                 key={game.id}
                 className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
                 onClick={() => navigate(`/games/${game.id}`)}
               >
                 <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
                 <p className="text-gray-600 text-sm mb-4">
                   {game.description}
                 </p>
                 <p className="text-blue-600 font-medium">Play now →</p>
               </div>
             ))}
           </div>
         ) : (
           <p className="text-gray-700">No games available at the moment.</p>
         )}
       </main>

       {/* Footer Section */}
       <footer className="bg-gray-800 text-white py-4">
         <div className="container mx-auto px-4 text-center">
           <p className="text-sm">
             © {new Date().getFullYear()} Game Platform. All rights reserved.
           </p>
         </div>
       </footer>
     </div>
   );
};

export default Dashboard;
