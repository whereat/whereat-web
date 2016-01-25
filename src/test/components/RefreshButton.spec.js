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
chai.use(sinonChai);
const should = chai.should();


import Application from '../../app/application';

import { createApplication } from 'marty/test-utils';
import testTree from 'react-test-tree';
import { shouldHaveBeenCalledWithImmutable } from '../support/matchers';

import User from '../../app/models/User';
import RefreshButton from '../../app/components/RefreshButton';

describe('RefreshButton Component', () => {

  const setup = () => {

    const spies = { refresh: sinon.spy() };
    const app = createApplication(Application, {
      stub: { locSubActions: spies }
    });
    return [app, spies];
  };

  const propTree = (app, color) => testTree(<RefreshButton.InnerComponent />, settings(app));
  const tree = (app) => testTree(<RefreshButton />, settings(app));
  const settings = (app) => ({context: { app: app }});

  describe('contents', () => {

    describe('button', () => {

      it('is rendered with correct styling', () => {
        const [app] = setup();
        const cb = propTree(app);

        cb.button.getClassName().should.equal('refreshButton btn btn-default');
        cb.glyphicon.getClassName().should.equal('glyphicon glyphicon-refresh');
      });
    });
  });

  describe('events', () =>{


    describe('clicking clear button', () => {

      it('calls locSubActions#refresh', () => {
        const [app, {refresh}] = setup();
        const comp = tree(app);
        comp.innerComponent.click();

        refresh.should.have.been.calledOnce;
      });
    });

  });
});
