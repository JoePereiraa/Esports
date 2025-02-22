import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import './styles/main.css';
import logoImg from './assets/logo-nlw-esports.svg';

// import { GameBanner } from './components/GameBanner';
import { CreateAdBanner } from './components/CreateAdBanner';
import { GameController } from '@phosphor-icons/react';
import { Input } from './components/Form/Input';

const GameBanner = React.lazy(() => import('./components/GameBanner'));

interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number
  }
}

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:3333/games')
        .then(response => response.json())
        .then(data => {
          setGames(data);
          setLastUpdated(new Date());
        })
        .catch(error => {
          console.error('Erro ao buscar os jogos:', error);
        });
    };

    // Chamada inicial à API
    fetchData();

    // Configura o setInterval para chamar a função fetchData a cada 30 segundos
    const intervalId = setInterval(fetchData, 30000); // 30 segundos em milissegundos
    // Retorna uma função de limpeza para parar o setInterval quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [])

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
      <img src={logoImg} />
      <h1 className="text-6xl text-white font-black mt-20">
        Seu <span className="bg-nlw-gradient text-transparent bg-clip-text">duo</span> está aqui.
      </h1>
        <p className="text-white">Última atualização: {lastUpdated && lastUpdated.toLocaleString()}</p>
        <div className='grid grid-cols-6 gap-6 mt-16'>
          {games.map(game => {
            return (
              <GameBanner
                key={game.id} 
                title={game.title}
                bannerUrl={game.bannerUrl}
                countAds={game._count.ads}
              />
            )
          })}
        </div>

        <Dialog.Root>
          <CreateAdBanner />
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/60 inset-0 fixed"/>

            <Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[488px] rounded-lg shadow-lg shadow-black/25">
              <Dialog.Title className="text-3xl font-black">Publicar anúncio</Dialog.Title>


                <form className="mt-8 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="game" className="font-semibold">Qual o game?</label>
                    <Input id="game" placeholder="Selecione o game que deseja jogar"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="name">Seu nome (ou nickname)</label>
                    <Input id="name" placeholder="Como te chamam dentro do game?" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="yearsPlaying">Joga ha quantos anos?</label>
                      <Input id="yearsPlaying" type="number" placeholder="Tudo bem ser ZERO" />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="discord">Qual o seu Discord?</label>
                      <Input id="discord" placeholder="Usuario#0000" />
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="weekDays">Quando costuma jogar?</label>

                      <div className="grid grid-cols-4 gap-2">
                        <button className="w-8 h-8 rounded bg-zinc-900" title="Domingo">D</button>
                        <button className="w-8 h-8 rounded bg-zinc-900" title="Segunda">S</button>
                        <button className="w-8 h-8 rounded bg-zinc-900" title="Terca">T</button>
                        <button className="w-8 h-8 rounded bg-zinc-900" title="Quarta">Q</button>
                        <button className="w-8 h-8 rounded bg-zinc-900" title="Quinta">Q</button>
                        <button className="w-8 h-8 rounded bg-zinc-900" title="Sexta">S</button>
                        <button className="w-8 h-8 rounded bg-zinc-900" title="Sabado">S</button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <label htmlFor="hourStart">Qual horario do dia?</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input id="hourStart" type="time" placeholder="De"/>
                        <Input id="hourEnd" type="time" placeholder="Ate"/>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex gap-2 text-small">
                    <Input type="checkbox"/>
                    Costumo me conectar com chat de voz
                  </div>
                  <footer className="mt-4 flex justify-end gap-4">
                    <Dialog.Close 
                      type="button" 
                      className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
                    >
                      Cancelar
                    </Dialog.Close>
                    <button 
                      type="submit"
                      className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600"
                    >
                      <GameController size={24}/>
                      Encontrar Duo
                    </button>
                  </footer>
                </form>

            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
    </div>
  )
}

export default App
