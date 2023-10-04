/*
	Projet Zone01 : Bomberman
	Tony Quedeville 
	15/09/2023

	Grille de jeu 
*/

import React, { useEffect, useState, useRef } from 'react'
import { socket } from '../../../socket'
import pl1 from '../../../assets/img/starship-1.png'
import pl2 from '../../../assets/img/starship-2.png'
import pl3 from '../../../assets/img/starship-3.png'
import pl4 from '../../../assets/img/starship-4.png'

const Grille = ({user, game, chronoStart, winner}) => {
    // console.log("game:", game);

    const pls = [pl1, pl2, pl3, pl4]
    const [coords, setCoords] = useState( [[1,1], [1,13], [11,1] ,[11,13]] )
    const [movements, setMovements] = useState(["", "", "", ""]);

    const grilleRef = useRef(null);
    const [grilleSize, setGrilleSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const grilleElement = grilleRef.current;
    
        const updateGrilleSize = () => {
            if (grilleElement) {
                const grilleWidth = grilleElement.clientWidth;
                const grilleHeight = grilleElement.clientHeight;
                setGrilleSize({ width: grilleWidth, height: grilleHeight });
            }
        };
    
        // Appelez la fonction de mise à jour de la taille de la grille lorsque la fenêtre est redimensionnée
        window.addEventListener('resize', updateGrilleSize);
    
        // Appelez la fonction de mise à jour de la taille de la grille au chargement initial
        updateGrilleSize();
    
        // Nettoyez le gestionnaire d'événements lorsque le composant est démonté
        return () => {
            window.removeEventListener('resize', updateGrilleSize);
        };
    }, [grilleRef]);


    useEffect(() => {    
        game.players.forEach((player, index) => {
            setCoords((prevCoords) => {
                // Créez une nouvelle copie du tableau d'état et mettez à jour les coordonnées pour le joueur actuel
                const newCoords = [...prevCoords];
                newCoords[index] = [player.coord[0], player.coord[1]];
                return newCoords;
            });
            
            setMovements((prevMovements) => {
                // Créez une nouvelle copie du tableau d'état et mettez à jour le mouvement pour le joueur actuel
                const newMovements = [...prevMovements];
                newMovements[index] = player.orientation;
                return newMovements;
            });

            /* Explication Chat-GPT:
            Nous sommes obligés de faire une copie parce que React gère l'état de manière asynchrone, ce qui signifie que 
            lorsque vous appelez une fonction de mise à jour de l'état, React peut regrouper plusieurs mises à jour d'état 
            en une seule opération pour des performances optimales. Cela signifie que si vous effectuez plusieurs mises à 
            jour d'état consécutives avec setCoords ou setMovements dans une boucle, React peut ne pas appliquer chaque mise 
            à jour immédiatement, ce qui peut entraîner des problèmes inattendus.

            Pour éviter ce problème, il est recommandé de toujours utiliser une fonction de mise à jour de l'état lorsque 
            la nouvelle valeur dépend de l'ancienne valeur de l'état. Dans le cas de tableaux ou d'objets d'état, vous devez 
            créer une nouvelle copie de l'objet existant avec les modifications nécessaires, plutôt que de modifier directement l'objet existant. Cela garantit que chaque mise à jour est correctement appliquée.

            C'est pourquoi dans le code corrigé, nous utilisons une fonction de mise à jour de l'état et créons une nouvelle 
            copie du tableau d'état existant (prevCoords ou prevMovements) pour y apporter des modifications. Cette approche 
            garantit que les mises à jour sont appliquées correctement et de manière prévisible.
            */
        })

        // Ajoute les gestionnaires d'événements lorsque le composant est monté
        document.addEventListener('keydown', handleKeyDown);
    
        // Nettoie les gestionnaires d'événements lorsque le composant est démonté
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };


        // Evènements clavier
        function handleKeyDown(event) {
            if(game.isPlay){
                // Mouvement players
                game.players.forEach((player) => {
                    let mouvement = ''

                        switch (event.key) {
                            case 'ArrowLeft':
                                mouvement = 'gauche'
                            break;
                            case 'ArrowRight':
                                mouvement = 'droite'
                            break;
                            case 'ArrowUp':
                                mouvement = 'haut'
                            break;
                            case 'ArrowDown':
                                mouvement = 'bas'
                            break;
                        
                            default:
                                mouvement = ''
                                break;
                        }

                        if(player.socketId === user.socketId && mouvement !== ''){
                            if (!event.shiftKey) {
                                socket.emit(mouvement, "game_" + game.gameId)
                            } else {
                                socket.emit('orient' + mouvement, "game_" + game.gameId)
                            } 
                        }
                })

                // Pose d'un BigBang
                if (event.key === ' ') {
                    socket.emit('espace', "game_" + game.gameId)
                }
            }
        }
    }, [game, user]);


    return (
        <div id="gridspace">
            <div id="grille" ref={grilleRef}>
                {/* Players */}
                {game.players && game.players.map((player, index) => (
                    player.socketId && 
                    <div 
                        id={"pl_" + (index+1)}
                        className={`Pl ${movements[index]} `} 
                        style={{ 
                                left: coords[index][1] * (grilleSize.width / 15) + 'px', 
                                top: coords[index][0] * (grilleSize.height / 13) + 'px',
                            }}
                    >
                        <div
                            id={"pl" + (index + 1)} 
                            className={`${game.bigBangs && Object.values(game.bigBangs).map((bb) => {
                                let direction = '';
                                if (bb.elementsAdjacent && bb.elementsAdjacent.some((el) => el.id === "Pl_" + (index + 1))) {
                                    for (let i = 0; i < bb.elementsAdjacent.length; i++) {
                                        if (bb.elementsAdjacent[i].id === "Pl_" + (index + 1)) {
                                            direction = bb.elementsAdjacent[i].direction;
                                            break;
                                        }
                                    }
                                }
                                return direction ? direction : ''
                            }).join(' ')}`}
                        >
                            <img src={`${pls[index]}`}   alt="" />
                        </div>
                    </div>
                ))}

                {/* Grille */}
                {game.gameGrid.map((elemCol, col) => (
                    <div className='vertical col' style={{ left: col * (grilleSize.width / 15) + 'px'}} key={col}>
                        { elemCol.map((elem, lig) => (
                            <div className='case' style={{ top: lig * (grilleSize.height / 13) + 'px' }} key={lig}>
                                {/* Blocks */}
                                {elem === "Bl" && <div className='block'></div>}

                                {/* BingBang */}
                                {elem.split('_')[0] === "Bb" && <div className={`Bb`}></div>}

                                {/* Galaxies + Attraction */}
                                {elem.split('_')[0] === "Gl" && (
                                <div id={elem} className={`Gl ${Object.values(game.bigBangs).map((bb) => {
                                    let AttractionDirection = '';
                                    if (bb.elementsAdjacent && bb.elementsAdjacent.some((el) => el.id === elem)) {
                                        for (let i = 0; i < bb.elementsAdjacent.length; i++) {
                                            if (bb.elementsAdjacent[i].id === elem) {
                                                AttractionDirection = bb.elementsAdjacent[i].direction;
                                                break;
                                            }
                                        }
                                    }
                                    return AttractionDirection ? AttractionDirection : ''
                                }).join(' ')}`}>
                                    <img alt="" className={`${Object.values(game.bigBangs).map((bb) => {
                                        let AttractionDirection = '';
                                        if (bb.elementsAdjacent && bb.elementsAdjacent.some((el) => el.id === elem)) {
                                            for (let i = 0; i < bb.elementsAdjacent.length; i++) {
                                                if (bb.elementsAdjacent[i].id === elem) {
                                                    AttractionDirection = bb.elementsAdjacent[i].direction;
                                                    break;
                                                }
                                            }
                                        }
                                        return AttractionDirection ? '' : ''
                                    }).join(' ')
                                    }`} />
                                </div>
                                )}

                                {/* Planetes (bonus) */}
                                {elem.split('_')[0] === "Bn" && (
                                <div id={elem} className={`Bn ${Object.values(game.bigBangs).map((bb) => {
                                    let AttractionDirection = ''
                                    if (bb.elementsAdjacent && bb.elementsAdjacent.some((el) => el.id === elem)) {
                                        for (let i = 0; i < bb.elementsAdjacent.length; i++) {
                                            if (bb.elementsAdjacent[i].id === elem) {
                                                AttractionDirection = bb.elementsAdjacent[i].direction
                                                break
                                            }
                                        }
                                    }
                                    return AttractionDirection ? AttractionDirection : ''
                                }).join(' ')}`}>
                                    <img alt=""  className={`${elem.split('_').slice(0, 2).join("_")}`}/>
                                </div>
                                )}

                            </div> 
                        ))}
                    </div>
                ))}
            </div>
            
            {!game.isPlay && 
            <>
                <div className="rotate-message">
                </div>
                {chronoStart > 0 && (
                    <div className="game-message">
                        <p>Game {game.gameId}</p>
                        Start : {chronoStart} s
                    </div> 
                )}              
            </>
            }

            {winner !== "" &&  winner !== "equal" &&
                <>
                    <div className="rotate-message">
                    </div>
                    <div className="game-message">
                        <p>Dernier survivant</p>
                        {winner} !
                    </div>                 
                </>
            }

            {winner === "equal" &&
                <>
                    <div className="rotate-message">
                    </div>
                    <div className="game-message">
                        Aucun survivant !
                    </div>                 
                </>
            }
        </div>
    )
}

export default Grille