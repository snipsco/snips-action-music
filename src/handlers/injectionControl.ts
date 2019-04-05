import { Handler } from './index'
import { logger } from '../utils/logger'
import { Injection } from 'hermes-javascript'
import { message } from '../utils'
import { 
    SLOT_CONFIDENCE_THRESHOLD 
} from '../constants'

function startInjection(hermes) {
    hermes.injection().publish('injection_request', {
        id: 'walkman_injection',
        lexicon: { },
        operations: [
            [
                Injection.enums.injectionKind.addFromVanilla,
                {
                    'snips/musicAlbum': [
                        'sweet baguette',
                        'crazy frank',
                        'lovely snipsters',
                        'fig trees'
                    ],
                    'snips/musicArtist': [
                        'baker\'s man',
                        'crazy snipsters',
                        'new orleans',
                        'super carman'
                    ]
                }
            ]
        ]
    })
}

function deleteInjection(hermes) {
    hermes.injection().publish('injection_request', {
        id: 'walkman_injection',
        lexicon: { },
        operations: [
            [
                Injection.enums.injectionKind.addFromVanilla,
                {
                    'snips/musicAlbum': [
                        'fake'
                    ],
                    'snips/musicArtist': [
                        'fake'
                    ]
                }
            ]
        ]
    })
}

export const injectionControlHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('injectionControlHandler')
    flow.end()

    let res = message.getSlotsByName(msg, 'if_revert', {
        onlyMostConfident: true,
        threshold: SLOT_CONFIDENCE_THRESHOLD
    })

    if (res) {
        deleteInjection(hermes)
        return 'Deleting Injection'
    } else {
        startInjection(hermes)
        return 'Starting Injection'
    }
}