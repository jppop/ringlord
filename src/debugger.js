import debug from 'debug';

const appName = "ringlord";

export function getLogger(subspace) {
  var namespace = appName;
  if (subspace) {
    namespace += ":" + subspace;
  }
  return debug(namespace);
}
