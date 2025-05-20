import { onMediaCrawlerUserSelection } from './on-user-selection'
import { onMediaCrawlerCommand } from './on-cmd-media-crawler'

export const mediaCrawlerListener = () => {
  onMediaCrawlerCommand()
}
