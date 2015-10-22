const sc = {};

// (Function, Number) => Cancellable
sc.schedule = (fn, millis) => setInterval(fn, millis);

// (Cancellable) => Unit
sc.cancel = (job) => clearInterval(job);

export default sc;
