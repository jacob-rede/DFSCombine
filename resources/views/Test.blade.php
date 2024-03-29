<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <meta content="">
    <style></style>
  </head>
  <body>
    <script>
      const worker = new Worker('/js/glpk-worker.js');
      worker.onerror = (err) => {
        console.log(err);
      };
      worker.onmessage = (evt) => {
        if (evt.data.initialized) {
          worker.postMessage({
            name: 'LP',
            objective: {
              direction: 2,
              name: 'obj',
              vars: [
                { name: 'x1', coef: 0.6 },
                { name: 'x2', coef: 0.5 }
              ]
            },
            subjectTo: [
              {
                name: 'cons1',
                vars: [
                  { name: 'x1', coef: 1.0 },
                  { name: 'x2', coef: 2.0 }
                ],
                bnds: { type: 3, ub: 1.0, lb: 0.0 }
              },
              {
                name: 'cons2',
                vars: [
                  { name: 'x1', coef: 3.0 },
                  { name: 'x2', coef: 1.0 }
                ],
                bnds: { type: 3, ub: 2.0, lb: 0.0 }
              }
            ]
          });
        }
        window.document.getElementById('out').innerHTML = JSON.stringify(evt.data, null, 2);
      };
    </script>
    <pre id='out'></pre>
  </body>
</html>
