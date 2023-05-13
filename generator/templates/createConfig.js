const fs = require('fs');
const rootDir = require('../rootDir');
const publicApiTemplate = require('./publicApiTemplate');
const sliceTemplate = require('./sliceTemplate');
const typesTemplate = require('./typesTemplate');
const serviceTemplate = require('./serviceTemplate');
const selectorsTemplate = require('./selectorsTemplate');
const testTemplate = require('./testTemplate');

module.exports = (layer, slice) => {
  const resolveConfigPath = (...segments) => rootDir('src', layer, slice, 'config', ...segments);

  const createConfigStructure = () => {
    try {
      fs.mkdirSync(resolveConfigPath());
      fs.mkdirSync(resolveConfigPath('selectors'));
      fs.mkdirSync(resolveConfigPath('service'));
      fs.mkdirSync(resolveConfigPath('slice'));
      fs.mkdirSync(resolveConfigPath('types'));
    } catch (e) {
      throw new Error(`Не удалось создать config для слоя ${slice}`);
    }
  };

  const createReduxSlice = () => {
    try {
      const sliceName = `${slice}Slice`;
      const sliceNameWithExtension = `${sliceName}.ts`;

      fs.writeFileSync(resolveConfigPath('slice', sliceNameWithExtension), sliceTemplate(slice));
      fs.writeFileSync(resolveConfigPath('slice', `index.ts`), publicApiTemplate([sliceName]));
      fs.mkdirSync(resolveConfigPath('slice', '__test__'));
      fs.writeFileSync(resolveConfigPath('slice', `__test__`, `${sliceName}.test.ts`), testTemplate(sliceName));
    } catch (e) {
      throw new Error(`Не удалось создать redux store для слайса ${slice}`);
    }
  };

  const createTypes = () => {
    try {
      const typeName = `${slice}Types`;
      const typeNameWithExtension = `${typeName}.types.ts`;

      fs.writeFileSync(resolveConfigPath('types', typeNameWithExtension), typesTemplate(typeName));
      fs.writeFileSync(resolveConfigPath('types', `index.ts`), publicApiTemplate([`${typeName}.types`]));
    } catch (e) {
      throw new Error(`Не удалось создать типы redux store для слайса ${slice}`);
    }
  };

  const createService = () => {
    try {
      const serviceName = `get${slice}`;
      const serviceNameWithExtension = `${serviceName}.service.ts`;

      fs.writeFileSync(resolveConfigPath('service', serviceNameWithExtension), serviceTemplate(slice, serviceName));
      fs.writeFileSync(resolveConfigPath('service', `index.ts`), publicApiTemplate([`${serviceName}.service`]));
      fs.mkdirSync(resolveConfigPath('service', '__test__'));
      fs.writeFileSync(
        resolveConfigPath('service', `__test__`, `${serviceName}.service.test.ts`),
        testTemplate(serviceName)
      );
    } catch (e) {
      throw new Error(`Не удалось создать сервис для redux store слайса ${slice}`);
    }
  };

  const createSelectors = () => {
    try {
      const selectorName = `get${slice}`;
      const selectorNameWithExtension = `${selectorName}.ts`;

      fs.writeFileSync(resolveConfigPath('selectors', selectorNameWithExtension), selectorsTemplate(selectorName));
      fs.writeFileSync(resolveConfigPath('selectors', `index.ts`), publicApiTemplate([selectorName]));
      fs.mkdirSync(resolveConfigPath('selectors', '__test__'));
      fs.writeFileSync(
        resolveConfigPath('selectors', `__test__`, `${selectorName}.test.ts`),
        testTemplate(selectorName)
      );
    } catch (e) {
      throw new Error(`Не удалось создать селектор для redux store слайсе ${slice}`);
    }
  };

  createConfigStructure();
  createReduxSlice();
  createService();
  createTypes();
  createSelectors();
  fs.writeFileSync(resolveConfigPath('index.ts'), publicApiTemplate(['types', 'slice', 'selectors']));
};
