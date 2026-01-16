import { PLAYER_VIEW_CY } from '@/config/selectors';

import { ExperimentLoader } from '../playerview/ExperimentLoader';

const PlayerView = (): JSX.Element => (
  <div className="player-view" data-cy={PLAYER_VIEW_CY}>
    <ExperimentLoader />
  </div>
);
export default PlayerView;
