import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
const should =  chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

import Application from '../../app/application';
import { createApplication } from 'marty/test-utils';

import {
  shouldHaveDispatched,
  shouldHaveDispatchedWith,
} from '../support/matchers';

import SettingsConstants from '../../app/constants/SettingsConstants';

describe('SettingsActions', () => {

  const setup = () => createApplication(Application, { include: ['settingsActions']});

  describe('#updateShare', () => {

    it('dispatches SHARE_INTERVAL_CHANGED with new index', () => {

      const app = setup();
      app.settingsActions.setShare(3);

      shouldHaveDispatchedWith(app, SettingsConstants.SHARE_INTERVAL_CHANGED, 3);
    });
  });
});
