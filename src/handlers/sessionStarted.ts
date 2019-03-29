import { Hermes, SessionStartedMessage } from 'hermes-javascript'
import { SnipsPlayer } from '../snipsPlayer'

export const sessionStarted = async function(msg: SessionStartedMessage, hermes: Hermes, player: SnipsPlayer){
    // lower the music volum 
    await player.setVolumeToSilence()

    // turn off the feedback sound
}