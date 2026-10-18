// Transport-neutral demonstration. No QQ connection and no messages are sent.
// Your bot maps a validated chat command to an Action; it does not calculate rules.
import {createSession,applyAction,getSessionView,serializeSession,deserializeSession,formatResult} from '../packages/core/dist/index.js';
export class BotSessions {
  #sessions=new Map();
  start(conversationAndUserKey,request){const s=createSession(request);this.#sessions.set(conversationAndUserKey,serializeSession(s));return getSessionView(s);}
  act(conversationAndUserKey,action,rng){
    const saved=this.#sessions.get(conversationAndUserKey);
    if(!saved)throw new Error('No active character generation session.');
    const next=applyAction(deserializeSession(saved),action,rng);
    this.#sessions.set(conversationAndUserKey,serializeSession(next));
    return getSessionView(next).phase==='complete'?formatResult(next,'zh'):getSessionView(next);
  }
}
// Production adapters must persist sessions and serialize concurrent commands per key.
