name := "magda-ckan-connector"

scalacOptions := Seq("-unchecked", "-deprecation", "-encoding", "utf8")

resolvers += Resolver.bintrayRepo("monsanto", "maven")

libraryDependencies ++= {
  val akkaV       = "2.4.9"
  val scalaTestV  = "2.2.6"
  Seq(
    "com.typesafe.akka" %% "akka-actor" % akkaV,
    "com.typesafe.akka" %% "akka-stream" % akkaV,
    "com.typesafe.akka" %% "akka-http-experimental" % akkaV,
    "com.typesafe.akka" %% "akka-http-spray-json-experimental" % akkaV,
    "com.typesafe.akka" %% "akka-http-xml-experimental" % akkaV,
    "com.typesafe.akka" %% "akka-contrib" % akkaV,
    "ch.megard" %% "akka-http-cors" % "0.1.5",
    "com.sksamuel.elastic4s" %% "elastic4s-core" % "2.3.0",
    "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.4",
    "com.rockymadden.stringmetric" %% "stringmetric-core" % "0.27.4",
    "com.monsanto.labs" %% "mwundo" % "0.1.0" exclude("xerces", "xercesImpl"),
    "org.scalaz" %% "scalaz-core" % "7.2.8",
    
    "com.typesafe.akka" %% "akka-http-testkit" % akkaV,
    "org.scalatest"     %% "scalatest" % scalaTestV % "test"
  )
}

unmanagedResourceDirectories in Compile ++= {
  if (Option(System.getProperty("excludeMockData")).getOrElse("false").equals("true")) {
    Nil
  } else {
    List(baseDirectory.value / ".." / "indexer" / "mock-data")
  }
}

dockerfile in docker := {
  val appDir: File = stage.value
  val targetDir = "/app"

  new Dockerfile {
    from("java")
    entryPoint(s"$targetDir/bin/${executableScriptName.value}")
    env("S3_SECRET_KEY", "DUMMY")
    copy(appDir, targetDir)
    expose(80)
  }
}

imageNames in docker := Seq(
  ImageName(
    namespace = Some("localhost:5000/data61"),
    repository = name.value,
    tag = Some("latest")
  )
)