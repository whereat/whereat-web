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
