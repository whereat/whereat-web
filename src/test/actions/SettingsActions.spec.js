/**
 *
 * Copyright (c) 2015-present, Total Location Test Paragraph.
 * All rights reserved.
 *
 * This file is part of Where@. Where@ is free software:
 * you can redistribute it and/or modify it under the terms of
 * the GNU General Public License (GPL), either version 3
 * of the License, or (at your option) any later version.
 *
 * Where@ is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For more details,
 * see the full license at <http://www.gnu.org/licenses/gpl-3.0.en.html>
 *
 */

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
