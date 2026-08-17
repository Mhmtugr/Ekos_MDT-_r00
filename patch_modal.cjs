const fs = require('fs');
let code = fs.readFileSync('src/components/NewMDTModal.tsx', 'utf8');

// The assignment section is wrapped in {isEngineeringOrAdmin ? ( ... )}
// Let's replace the whole condition rendering.
// We only want to show the assignment dropdowns if `currentUser.role === 'admin'`.

const target = `{/* Assigned Engineer Assignment Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">`;
const replacement = `{/* Assigned Engineer Assignment Section */}
              {currentUser.role === 'admin' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">`;

code = code.replace(target, replacement);

const targetEnd = `              </div>
            </>
          ) : (`;
const replacementEnd = `              </div>
              )}
            </>
          ) : (`;

code = code.replace(targetEnd, replacementEnd);

fs.writeFileSync('src/components/NewMDTModal.tsx', code);
