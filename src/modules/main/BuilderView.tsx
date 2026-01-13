import { BUILDER_VIEW_CY } from '@/config/selectors';

import AdminView from '../builderview/AdminView';

const BuilderView = (): JSX.Element => (
  <div data-cy={BUILDER_VIEW_CY}>
    <AdminView />
  </div>
);
export default BuilderView;
