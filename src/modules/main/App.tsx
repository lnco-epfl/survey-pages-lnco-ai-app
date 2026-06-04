import { useEffect } from 'react';

import { useLocalContext } from '@lnco-ai/apps-query-client';
import { Context } from '@lnco-ai/sdk';

import i18n, { DEFAULT_LANGUAGE } from '../../config/i18n';
import { ExperimentResultsProvider } from '../context/ExperimentContext';
import { SettingsProvider } from '../context/SettingsContext';
import AnalyticsView from './AnalyticsView';
import BuilderView from './BuilderView';
import PlayerView from './PlayerView';

const App = (): JSX.Element => {
  const context = useLocalContext();

  useEffect(() => {
    if (context.context === Context.Player) {
      return;
    }

    // handle a change of language
    const lang = context?.lang ?? DEFAULT_LANGUAGE;
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [context]);

  const renderContent = (): JSX.Element => {
    switch (context.context) {
      case Context.Builder:
        return <BuilderView />;

      case Context.Analytics:
        return <AnalyticsView />;

      case Context.Player:
      default:
        return <PlayerView />;
    }
  };

  return (
    <SettingsProvider>
      <ExperimentResultsProvider>{renderContent()}</ExperimentResultsProvider>
    </SettingsProvider>
  );
};

export default App;
