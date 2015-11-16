
import _ from 'lodash';
import path from 'path';
import { enrichHandlers } from './commons/metaUtils.js';
import { readFile, writeFile, parse, generate, formatJs } from './commons/utils.js';
import { getNonExistingActions } from './actionsIndex/actionsUtils.js';
import { getActionsFile } from './actions/actionsFile.js';
import * as api from './actions/index.js';

export function process(dataObject){

    const { modules, meta } = dataObject;

    return Promise.resolve().then( () => {

        return readFile(modules.actionsIndex.outputFilePath);

    }).then( fileData => {

        const ast = parse(fileData);
        let metaObj = enrichHandlers(meta);
        const nonExistingActionsMap = getNonExistingActions(ast, metaObj.actions);

        if(nonExistingActionsMap.size > 0){
            let resultSourceCode = getActionsFile({ meta: metaObj, newActions: nonExistingActionsMap, api });
            try{
                return formatJs(resultSourceCode);
            } catch (e){
                writeFile('__$error.js', resultSourceCode);
                throw e;
            }
        } else {
            return '';
        }

    });

}

