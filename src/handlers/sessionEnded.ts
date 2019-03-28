import { Hermes, SessionEndedMessage } from 'hermes-javascript'
import { SnipsPlayer } from '../snipsPlayer';

export const sessionEnded = function(msg: SessionEndedMessage, hermes: Hermes, player: SnipsPlayer){
    // turn back the music volume 
    player.setVolumeToNormal()

    // turn back the feedback sound
}