import { Hermes, SessionStartedMessage } from 'hermes-javascript'
import { SnipsPlayer } from '../SnipsPlayer'

export const sessionStarted = async function(msg: SessionStartedMessage, hermes: Hermes, players: SnipsPlayer[]){
    // lower the music volume
    players.forEach(player => {
        if (player.siteId == msg.siteId || player.siteId == msg.customData)
            player.setVolumeToSilence()
    })

    // turn off the feedback sound
}
