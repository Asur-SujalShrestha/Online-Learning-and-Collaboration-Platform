#heavy weigh, build stage
FROM maven:3.9.6-eclipse-temurin-21 As build

WORKDIR /app

COPY pom.xml .

COPY src ./src

RUN mvn clean package -DskipTests

#Light weight run time env -runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

RUN useradd --system --create-home spring

COPY --from=build --chown=spring:spring /app/target/CollApp-0.0.1-SNAPSHOT.jar app.jar

USER spring

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]