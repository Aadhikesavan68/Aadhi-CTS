# Module 3 — Core Java: Exercise Answers

This file contains concise solutions and example code snippets for the 41 Core Java exercises.

1) Hello World Program
```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

2) Simple Calculator (console)
```java
import java.util.Scanner;
public class Calculator {
  public static void main(String[] args) {
    Scanner s = new Scanner(System.in);
    double a = s.nextDouble(), b = s.nextDouble();
    char op = s.next().charAt(0);
    double r = switch(op) { case '+'->a+b; case '-'->a-b; case '*'->a*b; case '/'->a/b; default->Double.NaN; };
    System.out.println(r);
  }
}
```

3) Even or Odd Checker
```java
int n = Integer.parseInt(new java.util.Scanner(System.in).nextLine());
System.out.println((n%2==0)?"Even":"Odd");
```

4) Leap Year Checker
```java
int y = Integer.parseInt(new java.util.Scanner(System.in).nextLine());
boolean leap = (y%4==0 && y%100!=0) || (y%400==0);
System.out.println(leap?"Leap Year":"Not Leap Year");
```

5) Multiplication Table
```java
int n = 5; for(int i=1;i<=10;i++) System.out.println(n+" x "+i+" = "+(n*i));
```

6) Data Type Demonstration
```java
int i=10; float f=3.14f; double d=3.14159; char c='A'; boolean b=true;
System.out.printf("%d %f %f %c %b\n", i, f, d, c, b);
```

7) Type Casting Example
```java
double x = 9.7; int xi = (int)x; int y=5; double yd = (double)y;
System.out.println(xi+" " + yd);
```

8) Operator Precedence
```java
int result = 10 + 5 * 2; // result = 20 (multiplication before addition)
```

9) Grade Calculator
```java
int marks = 85; String grade = marks>=90?"A":marks>=80?"B":marks>=70?"C":marks>=60?"D":"F";
System.out.println(grade);
```

10) Number Guessing Game (simple loop)
```java
import java.util.*; int target=new Random().nextInt(100)+1; Scanner s=new Scanner(System.in); int g;
do{ g=s.nextInt(); System.out.println(g<target?"Too low":g>target?"Too high":"Correct"); }while(g!=target);
```

11) Factorial Calculator
```java
int n=5; long f=1; for(int i=2;i<=n;i++) f*=i; System.out.println(f);
```

12) Method Overloading
```java
public class Overload {
  static int add(int a,int b){return a+b;} static double add(double a,double b){return a+b;} static int add(int a,int b,int c){return a+b+c;} 
  public static void main(String[] args){ System.out.println(add(1,2)); System.out.println(add(1.5,2.5)); System.out.println(add(1,2,3)); }
}
```

13) Recursive Fibonacci
```java
int fib(int n){ return n<=1? n : fib(n-1)+fib(n-2); }
```

14) Array Sum and Average
```java
int[] arr = {1,2,3}; int sum=0; for(int v:arr) sum+=v; double avg = (double)sum/arr.length; System.out.println(sum+" " + avg);
```

15) String Reversal
```java
String s = "hello"; String rev = new StringBuilder(s).reverse().toString(); System.out.println(rev);
```

16) Palindrome Checker
```java
String t = "Madam".replaceAll("[^A-Za-z0-9]","" ).toLowerCase(); boolean pal = t.equals(new StringBuilder(t).reverse().toString()); System.out.println(pal);
```

17) Class and Object Creation
```java
class Car{ String make,model; int year; Car(String mk,String md,int y){make=mk;model=md;year=y;} void displayDetails(){System.out.println(make+" "+model+" "+year);} }
```

18) Inheritance Example
```java
class Animal{ void makeSound(){System.out.println("Some sound");} }
class Dog extends Animal{ @Override void makeSound(){System.out.println("Bark");} }
```

19) Interface Implementation
```java
interface Playable{ void play(); }
class Guitar implements Playable{ public void play(){System.out.println("Guitar playing");} }
```

20) Try-Catch Example
```java
try{ int a=10,b=0; System.out.println(a/b);}catch(ArithmeticException ex){System.out.println("Cannot divide by zero");}
```

21) Custom Exception
```java
class InvalidAgeException extends Exception{ InvalidAgeException(String m){super(m);} }
void checkAge(int age) throws InvalidAgeException{ if(age<18) throw new InvalidAgeException("Too young"); }
```

22) File Writing
```java
java.nio.file.Files.writeString(java.nio.file.Path.of("output.txt"), "Hello\n");
```

23) File Reading
```java
System.out.println(java.nio.file.Files.readString(java.nio.file.Path.of("output.txt")));
```

24) ArrayList Example
```java
var list = new java.util.ArrayList<String>(); list.add("Alice"); list.forEach(System.out::println);
```

25) HashMap Example
```java
var map = new java.util.HashMap<Integer,String>(); map.put(1,"Alice"); System.out.println(map.get(1));
```

26) Thread Creation
```java
class T extends Thread{ public void run(){ for(int i=0;i<5;i++) System.out.println("T"+i); } }
new T().start(); new T().start();
```

27) Lambda Expressions
```java
java.util.List<String> names = java.util.Arrays.asList("Bob","Alice","Tom"); names.sort((a,b)->a.compareToIgnoreCase(b)); System.out.println(names);
```

28) Stream API
```java
var nums = java.util.List.of(1,2,3,4,5,6); var evens = nums.stream().filter(n->n%2==0).toList(); System.out.println(evens);
```

29) Records
```java
record Person(String name,int age){}
var p = new Person("A",20); System.out.println(p);
```

30) Pattern Matching for switch (Java 21)
```java
static void check(Object o){ switch(o){ case Integer i -> System.out.println("Integer: "+i); case String s -> System.out.println("String: "+s); default -> System.out.println("Other"); } }
```

31) Basic JDBC Connection (example skeleton)
```java
Class.forName("com.mysql.cj.jdbc.Driver");
try(var conn = java.sql.DriverManager.getConnection(url,user,pass);
    var stmt = conn.createStatement();
    var rs = stmt.executeQuery("SELECT * FROM students")){
  while(rs.next()) System.out.println(rs.getString(1));
}
```

32) Insert and Update Operations in JDBC (prepared statement)
```java
try(var conn = DriverManager.getConnection(url,user,pass)){
  try(var ps = conn.prepareStatement("INSERT INTO students(name) VALUES(?)")){
    ps.setString(1,"Alice"); ps.executeUpdate();
  }
}
```

33) Transaction Handling in JDBC
```java
conn.setAutoCommit(false);
try(PreparedStatement d=conn.prepareStatement("UPDATE accounts SET bal=bal-? WHERE id=?");
    PreparedStatement c=conn.prepareStatement("UPDATE accounts SET bal=bal+? WHERE id=?")){
  d.setBigDecimal(1, amount); d.setInt(2, from);
  c.setBigDecimal(1, amount); c.setInt(2, to);
  d.executeUpdate(); c.executeUpdate(); conn.commit();
}catch(Exception ex){ conn.rollback(); }
```

34) Create and Use Java Modules (short)
```
module com.utils { exports com.utils; }
module com.greetings { requires com.utils; }
```

35) TCP Client -Server Chat (skeleton)
```java
// Server: ServerSocket ss = new ServerSocket(9000); Socket s = ss.accept(); // then use streams
// Client: Socket s = new Socket(host,9000);
```

36) HTTP Client API (Java 11+)
```java
var client = java.net.http.HttpClient.newHttpClient();
var req = java.net.http.HttpRequest.newBuilder(java.net.URI.create("https://api.github.com")).build();
var resp = client.send(req, java.net.http.HttpResponse.BodyHandlers.ofString());
System.out.println(resp.statusCode());
```

37) Using javap to Inspect Bytecode
```
javac MyClass.java
javap -c MyClass
```

38) Decompile a Class File
```
// Use JD-GUI or 'java -jar cfr.jar MyClass.class' to view decompiled source
```

39) Reflection in Java
```java
Class<?> c = Class.forName("java.lang.String"); for(var m: c.getDeclaredMethods()) System.out.println(m.getName());
```

40) Virtual Threads (Java 21)
```java
for(int i=0;i<1000;i++) Thread.startVirtualThread(()-> System.out.println("hello"));
```

41) Executor Service and Callable
```java
var ex = java.util.concurrent.Executors.newFixedThreadPool(4);
var futures = java.util.List.of(
  ex.submit(()=>"a"), ex.submit(()=>"b")
);
for(var f: futures) System.out.println(f.get());
ex.shutdown();
```

---
File: Module 3-Core Java.md — concise answers. If you want full standalone .java files for each exercise I can generate them in a folder and push as well.
