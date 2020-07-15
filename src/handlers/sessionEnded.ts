import { Hermes, SessionEndedMessage } from 'hermes-javascript'
import { SnipsPlayer } from '../SnipsPlayer'

export const sessionEnded = async function(msg: SessionEndedMessage, hermes: Hermes, players: SnipsPlayer[]){
    // turn back the music volume
    players.forEach(player => {
        if (player.siteId == msg.siteId || player.siteId == msg.customData)
            player.setVolumeToNormal()
    })

    // turn back the feedback sound
}
