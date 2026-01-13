import { PLAYER_VIEW_CY } from '@/config/selectors';

import SurveyLoader from '../playerview/SurveyLoader';

const PlayerView = (): JSX.Element => (
  <div className="player-view" data-cy={PLAYER_VIEW_CY}>
    <SurveyLoader />
  </div>
);
export default PlayerView;
