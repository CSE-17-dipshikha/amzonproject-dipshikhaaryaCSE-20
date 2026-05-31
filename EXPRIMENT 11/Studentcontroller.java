package com.example.demo;

import org.springframework.web.bind.annotation.*;

@RestController
public class StudentController {

    @GetMapping("/")

    public String home(){

        return "Welcome to Spring Boot";
    }

    @GetMapping("/student")

    public Student getStudent(){

        return new Student(101, "Rahul");
    }

    @PostMapping("/add")

    public String addStudent(){

        return "Student Added Successfully";
    }
}