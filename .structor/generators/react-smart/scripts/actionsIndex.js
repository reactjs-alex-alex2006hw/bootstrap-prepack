import _ from 'lodash';
import path from 'path';
import { enrichHandlers } from './commons/metaUtils.js';
import { readFile, parse, generate, formatJs } from './commons/utils.js';
import { injectNonExistingActions } from './actionsIndex/actionsIndexFile.js';

export function process(dataObject){

    const { modules, meta } = dataObject;

    return Promise.resolve().then( () => {

        return readFile(modules.actionsIndex.outputFilePath);

    }).then( fileData => {

        let result = fileData;
        let newAst = null;
        try{
            const ast = parse(fileData);
            let metaObj = enrichHandlers(meta);
            newAst = injectNonExistingActions(ast, metaObj.actions, modules.actions.relativeFilePath);
        } catch(e){
            throw Error('Parsing file: ' + modules.actionsIndex.outputFilePath + '. ' + e);
        }

        try{
            result = formatJs(generate(newAst));
        } catch(e){
            throw Error('Generating file: ' + modules.actionsIndex.outputFilePath + '. ' + e);
        }

        return result;

    });

}

