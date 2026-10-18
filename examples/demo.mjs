import {createSession,applyAction,getSessionView,formatResult,sequenceRng} from '../packages/core/dist/index.js';
// Deliberately fixed dice: the example is reproducible, not a real random roll.
let session=createSession({versionId:'adnd2e',methodId:'adnd2e.phb-VI'});
session=applyAction(session,{type:'roll'},sequenceRng([6,4,5,3,2,1,6]));
const targets=['STR','STR','DEX','CON','INT','WIS','CHA'];
for(const [i,die] of getSessionView(session).attempt.looseDice.entries()) {
  session=applyAction(session,{type:'allocateDie',dieId:die.id,ability:targets[i]});
}
session=applyAction(session,{type:'finalize'});
console.log(formatResult(session,'zh'));
console.log('\n--- English ---\n'+formatResult(session,'en'));
