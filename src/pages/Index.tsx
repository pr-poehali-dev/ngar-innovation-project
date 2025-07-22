import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Mission {
  id: number;
  title: string;
  description: string;
  reward: number;
  difficulty: 'Легко' | 'Средне' | 'Сложно';
  status: 'available' | 'completed' | 'locked';
  location: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'auth' | 'menu' | 'game' | 'missions' | 'settings'>('auth');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [userAccount, setUserAccount] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [playerStats, setPlayerStats] = useState({
    level: 1,
    experience: 0,
    money: 500,
    completedMissions: 0,
    kills: 0
  });

  // Game settings
  const [gameSettings, setGameSettings] = useState({
    botCount: 3,
    gameTime: 120, // seconds
    difficulty: 'medium'
  });

  // Game state
  const [gameState, setGameState] = useState({
    isPlaying: false,
    timeLeft: 120,
    playerPosition: 90,
    botPositions: [15, 25, 35],
    eliminatedBots: 0,
    gameResult: null as 'win' | 'lose' | null
  });

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      interval = setInterval(() => {
        setGameState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft === 0) {
            // Game over - check if player won
            const result = prev.eliminatedBots >= gameSettings.botCount ? 'win' : 'lose';
            return { ...prev, timeLeft: 0, isPlaying: false, gameResult: result };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isPlaying, gameState.timeLeft, gameSettings.botCount]);

  const startGame = () => {
    const initialBotPositions = Array.from({length: gameSettings.botCount}, (_, i) => 
      10 + i * 15 + Math.floor(Math.random() * 10)
    );
    
    setGameState({
      isPlaying: true,
      timeLeft: gameSettings.gameTime,
      playerPosition: 90,
      botPositions: initialBotPositions,
      eliminatedBots: 0,
      gameResult: null
    });
  };

  const eliminateBot = (botIndex: number) => {
    setGameState(prev => ({
      ...prev,
      eliminatedBots: prev.eliminatedBots + 1,
      botPositions: prev.botPositions.filter((_, i) => i !== botIndex)
    }));
    
    setPlayerStats(prev => ({
      ...prev,
      kills: prev.kills + 1,
      money: prev.money + 100
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const missions: Mission[] = [
    {
      id: 1,
      title: "Ночная пиццерия",
      description: "Проникни в заброшенную пиццерию. Охранники не должны тебя увидеть.",
      reward: 1500,
      difficulty: 'Легко',
      status: 'available',
      location: "Freddy's Pizza"
    },
    {
      id: 2,
      title: "Темный коридор",
      description: "Устрани цель в старом здании. Электричество отключено.",
      reward: 3000,
      difficulty: 'Средне',
      status: 'available',
      location: "Старая больница"
    },
    {
      id: 3,
      title: "Последняя ночь",
      description: "Самая опасная миссия. Множество охранников и сигнализация.",
      reward: 7500,
      difficulty: 'Сложно',
      status: 'locked',
      location: "Секретная база"
    }
  ];

  const startMission = (missionId: number) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission && mission.status === 'available') {
      setPlayerStats(prev => ({
        ...prev,
        money: prev.money + mission.reward,
        experience: prev.experience + 150,
        completedMissions: prev.completedMissions + 1,
        kills: prev.kills + Math.floor(Math.random() * 3) + 1
      }));
      
      mission.status = 'completed';
      
      // Unlock next mission
      if (missionId === 2) {
        const nextMission = missions.find(m => m.id === 3);
        if (nextMission) nextMission.status = 'available';
      }
    }
  };

  const MenuView = () => (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-purple-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Creepy background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl animate-pulse">🎭</div>
        <div className="absolute top-20 right-20 text-4xl animate-bounce">🔪</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-pulse">💀</div>
        <div className="absolute bottom-10 right-10 text-3xl animate-bounce">🩸</div>
      </div>

      <div className="text-center mb-12 z-10">
        <div className="text-8xl mb-6 animate-pulse">🎭</div>
        <h1 className="text-7xl font-bold text-red-500 mb-4 drop-shadow-2xl animate-pulse" 
            style={{fontFamily: 'Comic Sans MS', textShadow: '0 0 20px #ff0000'}}>
          FREDDY KILLER
        </h1>
        <p className="text-2xl text-gray-300 mb-8 animate-fade-in">
          Войди в темный мир наемного убийцы в маске Фредди
        </p>
        
        <div className="flex flex-col gap-6 max-w-md mx-auto">
          <Button 
            onClick={() => setCurrentView('missions')}
            className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white text-2xl py-6 px-10 rounded-xl shadow-2xl transform transition hover:scale-105 border-2 border-red-600"
            style={{fontFamily: 'Comic Sans MS'}}
          >
            <Icon name="Crosshair" className="mr-3" size={28} />
            🎯 Выбрать жертву
          </Button>
          
          <Button 
            onClick={() => setCurrentView('game')}
            className="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-800 hover:to-purple-950 text-white text-2xl py-6 px-10 rounded-xl shadow-2xl transform transition hover:scale-105 border-2 border-purple-600"
            style={{fontFamily: 'Comic Sans MS'}}
          >
            <Icon name="Gamepad2" className="mr-3" size={28} />
            🎮 Охота
          </Button>
          
          <Button 
            variant="outline"
            className="border-3 border-gray-400 text-gray-300 hover:bg-gray-900 hover:border-red-500 text-xl py-4 px-8 rounded-xl transition-all"
            style={{fontFamily: 'Comic Sans MS'}}
          >
            <Icon name="Settings" className="mr-2" size={24} />
            ⚙️ Настройки маски
          </Button>
        </div>
      </div>

      {/* Player Stats - Dark themed */}
      <Card className="bg-gradient-to-br from-gray-900 to-black border-red-800 max-w-lg w-full shadow-2xl">
        <CardHeader className="border-b border-red-800">
          <CardTitle className="text-red-400 text-center text-xl" style={{fontFamily: 'Comic Sans MS'}}>
            🎭 Статистика Фредди
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-6 text-white">
            <div className="text-center">
              <Icon name="Skull" className="mx-auto mb-2 text-red-500" size={32} />
              <p className="text-sm text-red-300">Убийств</p>
              <p className="text-3xl font-bold text-red-400">{playerStats.kills}</p>
            </div>
            <div className="text-center">
              <Icon name="DollarSign" className="mx-auto mb-2 text-green-400" size={32} />
              <p className="text-sm text-green-300">Деньги</p>
              <p className="text-3xl font-bold text-green-400">${playerStats.money}</p>
            </div>
            <div className="text-center">
              <Icon name="Star" className="mx-auto mb-2 text-yellow-400" size={32} />
              <p className="text-sm text-yellow-300">Уровень</p>
              <p className="text-3xl font-bold text-yellow-400">{playerStats.level}</p>
            </div>
            <div className="text-center">
              <Icon name="Trophy" className="mx-auto mb-2 text-purple-400" size={32} />
              <p className="text-sm text-purple-300">Миссий</p>
              <p className="text-3xl font-bold text-purple-400">{playerStats.completedMissions}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MissionsView = () => (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={() => setCurrentView('menu')}
            variant="outline"
            className="border-red-600 text-red-400 hover:bg-red-950 hover:border-red-400"
            style={{fontFamily: 'Comic Sans MS'}}
          >
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            🔙 Назад в логово
          </Button>
          
          <h2 className="text-5xl font-bold text-red-500 drop-shadow-lg" 
              style={{fontFamily: 'Comic Sans MS', textShadow: '0 0 15px #ff0000'}}>
            🎯 СПИСОК ЖЕРТВ
          </h2>
          
          <div className="text-right text-white">
            <p className="text-lg">💰 ${playerStats.money}</p>
            <p className="text-lg">💀 {playerStats.kills} убийств</p>
            <p className="text-lg">⭐ Уровень {playerStats.level}</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => (
            <Card key={mission.id} 
                  className="bg-gradient-to-br from-gray-900 to-black border-red-800 hover:border-red-500 transition-all duration-500 shadow-2xl transform hover:scale-105">
              <CardHeader className="border-b border-red-800">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-red-400 text-xl" style={{fontFamily: 'Comic Sans MS'}}>
                    {mission.title}
                  </CardTitle>
                  <Badge 
                    variant={mission.difficulty === 'Легко' ? 'default' : mission.difficulty === 'Средне' ? 'secondary' : 'destructive'}
                    className="text-sm font-bold"
                  >
                    {mission.difficulty}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm">📍 {mission.location}</p>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-300 mb-6 text-base leading-relaxed">{mission.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-green-400 font-bold text-xl">
                    <Icon name="DollarSign" className="inline mr-1" size={20} />
                    {mission.reward}
                  </span>
                  {mission.status === 'completed' && (
                    <div className="flex items-center text-green-400">
                      <Icon name="CheckCircle" className="mr-2" size={24} />
                      <span className="text-lg">✅ Убито</span>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => startMission(mission.id)}
                  disabled={mission.status === 'locked' || mission.status === 'completed'}
                  className={`w-full text-lg py-3 font-bold transition-all ${
                    mission.status === 'available' 
                      ? 'bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 border-2 border-red-600' 
                      : mission.status === 'completed'
                      ? 'bg-gradient-to-r from-green-700 to-green-900 border-2 border-green-600'
                      : 'bg-gray-700 border-2 border-gray-600'
                  }`}
                  style={{fontFamily: 'Comic Sans MS'}}
                >
                  {mission.status === 'available' && '🔪 Начать охоту'}
                  {mission.status === 'completed' && '💀 Жертва устранена'}
                  {mission.status === 'locked' && '🔒 Заблокировано'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const GameView = () => (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => setCurrentView('menu')}
            variant="outline"
            className="border-red-600 text-red-400 hover:bg-red-950"
            style={{fontFamily: 'Comic Sans MS'}}
          >
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            🔙 Вернуться
          </Button>
          
          <h2 className="text-4xl font-bold text-red-500" 
              style={{fontFamily: 'Comic Sans MS', textShadow: '0 0 10px #ff0000'}}>
            🎭 ОХОТНИЧЬИ УГОДЬЯ
          </h2>
          
          <div className="flex gap-4">
            <Badge variant="outline" className="text-red-400 border-red-400 text-lg px-4 py-2">
              <Icon name="Heart" className="mr-2 text-red-500" size={20} />
              ❤️ 100 HP
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400 text-lg px-4 py-2">
              <Icon name="Eye" className="mr-2 text-purple-500" size={20} />
              👁️ Скрытность
            </Badge>
          </div>
        </div>

        {/* Game Field - Horror themed */}
        <div className="grid grid-cols-10 gap-1 bg-gradient-to-br from-gray-950 to-black p-8 rounded-2xl border-2 border-red-800 shadow-2xl min-h-[600px]">
          {Array.from({length: 100}).map((_, index) => {
            const isPlayer = index === 90; // Freddy position
            const isVictim = [15, 35, 67].includes(index); // Victim positions
            const isObstacle = [22, 23, 24, 32, 33, 34, 42, 43, 44, 52, 53, 54].includes(index); // Tables/obstacles
            const isDarkZone = [10, 11, 20, 21, 60, 61, 70, 71].includes(index); // Dark hiding spots
            
            return (
              <div 
                key={index}
                className={`
                  aspect-square border border-gray-800 rounded-lg flex items-center justify-center text-3xl cursor-pointer
                  transition-all duration-300 hover:border-red-500 hover:shadow-lg
                  ${isPlayer ? 'bg-gradient-to-br from-red-700 to-red-900 border-red-500 shadow-red-500/50' : ''}
                  ${isVictim ? 'bg-gradient-to-br from-yellow-600 to-orange-700 border-yellow-500 animate-pulse' : ''}
                  ${isObstacle ? 'bg-gradient-to-br from-gray-700 to-gray-900 border-gray-600' : ''}
                  ${isDarkZone ? 'bg-gradient-to-br from-purple-900 to-black border-purple-700' : ''}
                  ${!isPlayer && !isVictim && !isObstacle && !isDarkZone ? 'bg-gray-900/30 hover:bg-gray-800/50' : ''}
                `}
              >
                {isPlayer && <span className="animate-pulse">🎭</span>}
                {isVictim && <span className="animate-bounce">👤</span>}
                {isObstacle && <span>🪑</span>}
                {isDarkZone && <span className="animate-pulse opacity-50">🌑</span>}
              </div>
            );
          })}
        </div>

        {/* Game Controls */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
            <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-950 text-lg py-4">
              <Icon name="ArrowUp" size={24} />
            </Button>
            <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-950 text-lg py-4">
              <Icon name="ArrowDown" size={24} />
            </Button>
            <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-950 text-lg py-4">
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-950 text-lg py-4">
              <Icon name="ArrowRight" size={24} />
            </Button>
          </div>
          
          <div className="bg-gray-900/80 p-6 rounded-xl border border-red-800 max-w-2xl mx-auto">
            <p className="text-red-400 text-xl mb-2" style={{fontFamily: 'Comic Sans MS'}}>
              🎭 - Ты (Фредди) | 👤 - Жертвы | 🪑 - Препятствия | 🌑 - Темные укрытия
            </p>
            <p className="text-gray-400 text-lg">
              Двигайся в тенях, избегай света и устраняй жертв незаметно!
            </p>
            <p className="text-red-300 text-sm mt-2">
              ⚠️ Не попадайся охранникам на глаза!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const AuthView = () => (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Creepy background effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl animate-pulse">🎭</div>
        <div className="absolute top-20 right-20 text-4xl animate-bounce">💀</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-pulse">🔪</div>
        <div className="absolute bottom-10 right-10 text-3xl animate-bounce">🩸</div>
      </div>

      <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black border-red-800 shadow-2xl">
        <CardHeader className="text-center border-b border-red-800">
          <div className="text-6xl mb-4 animate-pulse">🎭</div>
          <CardTitle className="text-3xl font-bold text-red-500" style={{fontFamily: 'Comic Sans MS', textShadow: '0 0 15px #ff0000'}}>
            {authMode === 'login' ? 'ВХОД В ИГРУ' : 'РЕГИСТРАЦИЯ'}
          </CardTitle>
          <p className="text-gray-400 mt-2">
            {authMode === 'login' ? 'Войди в мир Фредди' : 'Создай аккаунт убийцы'}
          </p>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="block text-red-400 mb-2 font-bold" style={{fontFamily: 'Comic Sans MS'}}>📧 Email</label>
              <input 
                type="email"
                value={userAccount.email}
                onChange={(e) => setUserAccount(prev => ({...prev, email: e.target.value}))}
                className="w-full p-3 bg-gray-800 border border-red-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                placeholder="your.email@killer.com"
              />
            </div>
          )}
          
          <div>
            <label className="block text-red-400 mb-2 font-bold" style={{fontFamily: 'Comic Sans MS'}}>👤 Никнейм</label>
            <input 
              type="text"
              value={userAccount.username}
              onChange={(e) => setUserAccount(prev => ({...prev, username: e.target.value}))}
              className="w-full p-3 bg-gray-800 border border-red-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              placeholder={authMode === 'login' ? 'Введи никнейм' : 'Придумай никнейм'}
            />
          </div>
          
          <div>
            <label className="block text-red-400 mb-2 font-bold" style={{fontFamily: 'Comic Sans MS'}}>🔐 Пароль</label>
            <input 
              type="password"
              value={userAccount.password}
              onChange={(e) => setUserAccount(prev => ({...prev, password: e.target.value}))}
              className="w-full p-3 bg-gray-800 border border-red-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              placeholder="Секретный пароль"
            />
          </div>
          
          <Button 
            onClick={() => {
              if (userAccount.username && userAccount.password) {
                setIsLoggedIn(true);
                setCurrentView('menu');
              }
            }}
            disabled={!userAccount.username || !userAccount.password || (authMode === 'register' && !userAccount.email)}
            className="w-full bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white text-xl py-4 font-bold border-2 border-red-600"
            style={{fontFamily: 'Comic Sans MS'}}
          >
            {authMode === 'login' ? '🎭 ВОЙТИ В ИГРУ' : '💀 СОЗДАТЬ АККАУНТ'}
          </Button>
          
          <div className="text-center">
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-gray-400 hover:text-red-400 transition-colors underline"
              style={{fontFamily: 'Comic Sans MS'}}
            >
              {authMode === 'login' ? 'Нет аккаунта? Зарегистрируйся' : 'Есть аккаунт? Войди'}
            </button>
          </div>
          
          <div className="bg-red-950/30 p-4 rounded-lg border border-red-800">
            <p className="text-red-300 text-sm text-center" style={{fontFamily: 'Comic Sans MS'}}>
              ⚠️ Внимание! Игра содержит элементы ужасов.
              <br />Играй на свой страх и риск! 🎭
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!isLoggedIn) {
    return <AuthView />;
  }

  return (
    <>
      {currentView === 'menu' && <MenuView />}
      {currentView === 'missions' && <MissionsView />}
      {currentView === 'game' && <GameView />}
    </>
  );
};

export default Index;