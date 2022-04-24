/* The below code is licensed under MIT. */

import { join } from '../../modules/Utilities';
import { findByProps } from '@cumcord/modules/webpack';

const classes = findByProps('emptyResultsWrap');

export default ({ noEasterEgg }: { noEasterEgg?: boolean; }): JSX.Element => {
  if (!noEasterEgg && Math.floor(Math.random() * 100) <= 10) {
    return (
      <div className={classes.emptyResultsWrap}>
        <div className={classes.emptyResultsContent} style={{ paddingBottom: '0px' }}>
          <div className={join(classes.noResultsImage, classes.alt)} />
          <div className={classes.emptyResultsText}>
            this account is empty also look at this picture of a bannana i found in discord's code
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={classes.emptyResultsWrap}>
        <div className={classes.emptyResultsContent} style={{ paddingBottom: '0px' }}>
          <div className={classes.noResultsImage} />
          <div className={classes.emptyResultsText}>
            No sperms were found in this account.
          </div>
        </div>
      </div>
    );
  }
};
