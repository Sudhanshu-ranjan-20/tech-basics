GoRoutine is a lightweight, independently executing function in Go, managed by the Go runtime, that runs concurrently with other parts of a program,

Starting a Go Routine does not execute immediately and recieving from channel blocks until data is available

So the workers start first and then wait

```
for i := 1; i <= 3; i++ {
    go worker(i, jobs, results)
}
```

the above code starts 3 goroutines in backgorund and does not start immediately
and each goroutine runs

```
for job := range jobs {
    ...
}
```

in loop which says that wait untill something arrives in jobs channel and since jobs channel is empty at the beginning the workers (go routines) moves into a sleeping/blocking state not wasting CPU. They are waiting for input. It automatically resumes when data comes

then main sends Jobs later

```
for _,url := range(urls) {
jobs <- Job{URL:url}
}
```

Now jobs are pushed one by one i.e.

Job1 wakes worker 1
Job2 wakes worker 2
Job3 wakes worker 3
next jobs are picked by whicever worker becomes free

## WHY WORKERS FIRST??

because then system is ready and jobs can be processed immediately and no delay after sending

if we send Jobs first then main goRoutine may block if no worker is receiving yet (unbuffered channel)

### CHANNEL TYPES AND THEIR EFFECT

1. BUFFERED CHANNEL -

   Key rule --> Send blocks only when buffer is full;
   if jobs channel has buffer:

   ```
   jobs := make(chan Job, len(urls))
   ```

   the main can send jobs even if the workers havent started yet.
   the buffer stores them

   when we close jobs we say that "NO MORE JOBS ARE COMING" the loop `for job:= range(jobs)` ends and worker exits gracefully

2. UNBUFFERED CHANNEL -

   KEY RULE - send blocks untill a reciever is ready and Recieve Blocks untill a sender is ready

   if lets say we made jobs channel unbuffered i.e.

   ```
   jobs := make(chan Job)
   ```

   and start worker first, the worker immediately blocks at job <- Jobs . Main sends a Job jobs <- Job{...} whch then sends handshakes with one waiting worker and completes which is the cleanest synchronous handoff.

   if lets say we send jobs first, and no worker is receiving yet main blocks forever unless we start workers in another goRoutine. Thats why we usually start workers first with unbuffered channels
