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

  describe('#setShareFreq', () => {

    it('dispatches SHARE_FREQUENCY_CHANGED with new index', () => {

      const app = setup();
      app.settingsActions.setShareFreq(3);

      shouldHaveDispatchedWith(app, SettingsConstants.SHARE_FREQUENCY_CHANGED, 3);
    });
  });

  describe('#setLocTtl', () => {

    it('dispatches LOC_TTL_CHANGED with new index', () => {

      const app = setup();
      app.settingsActions.setLocTtl(1);

      shouldHaveDispatchedWith(app, SettingsConstants.LOC_TTL_CHANGED, 1);
    });
  });
});
