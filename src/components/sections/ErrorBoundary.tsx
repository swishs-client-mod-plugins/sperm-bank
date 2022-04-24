/* The below code is licensed under MIT. */

/* https://github.com/Cumcord/Cumcord/blob/stable/src/api/ui/components/ErrorBoundary.jsx */

import Logger from '../../modules/Logger';

import { findByProps } from '@cumcord/modules/webpack';

const classes = findByProps('emptyResultsWrap');

import { pjoin } from '../../modules/Utilities';

export default class ErrorBoundary extends React.Component<{}, { error: boolean; }> {
  constructor(props) {
    super(props);

    this.state = { error: false };
  }

  static getDerivedStateFromError(error) {
    Logger.error(`There was an error parsing this sperm! Please report this error to Swishilicous#3200!!`, error);
    return { error: true };
  }

  render() {
    if (this.state.error) {
      return <div className={pjoin('error', classes.emptyResultsWrap)}>
        <div className={classes.emptyResultsContent} style={{ paddingBottom: '0px' }}>
          <div className={classes.errorImage} />
          <div className={classes.emptyResultsText}>
            There was an error parsing this sperm! The issue was logged in your console, press CTRL + I to access it!
          </div>
        </div>
      </div>;
    }

    return this.props.children;
  }
}
