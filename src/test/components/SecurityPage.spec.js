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
import marked from 'marked';
import fs from 'fs';
import strip from 'strip';
import { htmlDecode } from 'htmlencode';
import markdown from '../../app/modules/markdown';

import SecurityPage from '../../app/components/SecurityPage';
SecurityPage._parseMarkdown = (file) => marked(fs.readFileSync(`../../app/markdown/${file}`));


describe('SecurityPage component', () => {

  describe('contents', () => {

    it('renders correct markdown content', () => {

      const parse = sinon.stub(
        markdown, 'parse', (file) =>
          marked(fs.readFileSync(`./src/app/markdown/${file}`, 'utf8')));
      const warning = marked(fs.readFileSync('./src/app/markdown/SecurityWarning.md', 'utf8'));
      const comp = testTree(<SecurityPage.InnerComponent />);

      parse.should.have.been.calledOnce;
      comp.innerText.should.equal(htmlDecode(strip(warning)) + '\n');

      parse.restore();
    });
  });
});
