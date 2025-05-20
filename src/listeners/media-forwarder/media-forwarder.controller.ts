import { mediaForwarderListener } from './media-forwarder.listener'
import { add_mediaForwarderListener } from './add_media-forwarder.listener'
import { list_mediaForwarderListener } from './list_media-forwarder.listener'
import { removeMediaForwarderController } from './remove_media-forwarder.controller'

export const mediaForwarderController = () => {
  mediaForwarderListener()
  add_mediaForwarderListener()
  list_mediaForwarderListener()
  removeMediaForwarderController()
}
