import { Hermes, SessionEndedMessage } from 'hermes-javascript'
import { SnipsPlayer } from '../SnipsPlayer'

export const sessionEnded = async function(msg: SessionEndedMessage, hermes: Hermes, player: SnipsPlayer){
    // turn back the music volume 
    await player.setVolumeToNormal()

    // turn back the feedback sound
}