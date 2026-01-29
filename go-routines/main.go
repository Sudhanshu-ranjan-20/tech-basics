package main

import (
	"fmt"
	"net/http"
	"time"
)

type Job struct {
	URL string
}

type Result struct {
	URL    string
	Status string
}

func worker(id int, jobs <-chan Job, results chan<- Result) {
	for job := range jobs {
		fmt.Printf("Worker %d checking: %s\n", id, job.URL)

		client := http.Client{Timeout: 3 * time.Second}
		resp, err := client.Get(job.URL)

		if err == nil {
			results <- Result{job.URL, "ERROR"}
			continue
		}
		results <- Result{job.URL, resp.Status}
		resp.Body.Close()
	}
}

func main() {
	urls := []string{
		"https://google.com",
		"https://github.com",
		"https://golang.org",
		"https://example.com",
		"https://fake-site-xyz.com",
	}

	jobs := make(chan Job, len(urls))
	results := make(chan Result, len(urls))

	// start 3 workers

	for i := 1; i <= 3; i++ {
		go worker(i, jobs, results)
	}

	for _, url := range urls {
		jobs <- Job{URL: url}
	}

	close(jobs)

	fmt.Println("\n --- RESULTS ---")
	for i := 1; i <= len(urls); i++ {
		result := <-results
		fmt.Printf("?%s -> %s\n", result.URL, result.Status)
	}
}
