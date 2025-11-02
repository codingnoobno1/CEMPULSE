# CemPulse Project: Comprehensive Overview

## Table of Contents
1.  [Introduction](#1-introduction)
2.  [Project Overview](#2-project-overview)
3.  [Overall System Architecture](#3-overall-system-architecture)
4.  [Role-Based Access Control (RBAC) and Control System](#4-role-based-access-control-rbac-and-control-system)
    *   [4.1. Role-Based Access Control (Next.js - `cempulse`)](#41-role-based-access-control-nextjs---cempulse)
    *   [4.2. Control System](#42-control-system)
5.  [Dashboards](#5-dashboards)
    *   [5.1. Next.js Web Application Dashboards (`cempulse`)](#51-nextjs-web-application-dashboards-cempulse)
    *   [5.2. Flutter Mobile Application Dashboards (`flutter`)](#52-flutter-mobile-application-dashboards-flutter)
6.  [MQTT CSV Design](#6-mqtt-csv-design)
    *   [6.1. `mqtt_log.csv`](#61-mqtt_logcsv)
    *   [6.2. `plant_state_log.csv`](#62-plant_state_logcsv)
    *   [6.3. Logging Mechanism](#63-logging-mechanism)
7.  [Component Breakdown](#7-component-breakdown)
    *   [7.1. CemPulse Web Application (`cempulse/`)](#71-cempulse-web-application-cempulse)
    *   [7.2. CemPulse MQTT Backend Service (`CemPulseMqtt/`)](#72-cempulse-mqtt-backend-service-cempulsemqtt)
    *   [7.3. CemPulse Mobile Application (`flutter/`)](#73-cempulse-mobile-application-flutter)
8.  [Prerequisites](#8-prerequisites)
9.  [Getting Started](#9-getting-started)
    *   [9.1. Clone the Repository](#91-clone-the-repository)
    *   [9.2. Setup CemPulse MQTT Backend Service](#92-setup-cempulse-mqtt-backend-service)
    *   [9.3. Setup CemPulse Web Application](#93-setup-cempulse-web-application)
    *   [9.4. Setup CemPulse Mobile Application](#94-setup-cempulse-mobile-application)
10. [Contributing](#10-contributing)
11. [License](#11-license)
12. [Troubleshooting](#12-troubleshooting)
13. [Future Enhancements](#13-future-enhancements)

---

## 1. Introduction

The CemPulse project is a sophisticated, multi-platform monitoring and control system designed for industrial environments, particularly those leveraging IoT devices and MQTT for data communication. It provides a comprehensive solution for real-time data acquisition, visualization, and interaction across web and mobile platforms. This document serves as a detailed guide to the project's architecture, components, setup, and development.

## 2. Project Overview

CemPulse integrates three distinct applications that work in concert to provide a holistic view and control mechanism for industrial processes:

*   **CemPulse Web Application:** A modern web interface for detailed dashboards, analytics, and administrative functions.
*   **CemPulse MQTT Backend Service:** The central nervous system, responsible for ingesting data from IoT devices via MQTT, processing it, and serving it to client applications through a robust API.
*   **CemPulse Mobile Application:** A cross-platform mobile app offering on-the-go monitoring, alerts, and potentially advanced features like image-based analysis.

This modular approach ensures scalability, maintainability, and flexibility in deploying and managing industrial monitoring solutions.

## 3. Overall System Architecture

The CemPulse system operates on a client-server model with a strong emphasis on real-time data flow. IoT devices act as data producers, sending telemetry to the MQTT backend. This backend then acts as a data hub, distributing information to both web and mobile clients.

**[Diagram: High-Level System Architecture]**
*This diagram should illustrate the main components (IoT Devices, CemPulse MQTT Backend, CemPulse Web App, CemPulse Mobile App) and the primary data flow between them. Arrows should indicate communication paths (e.g., MQTT from IoT to Backend, API calls from Web/Mobile to Backend, direct MQTT subscription from Mobile to Backend).*

**Data Flow Summary:**
1.  **IoT Devices:** Publish sensor readings, status updates, and other operational data to specific MQTT topics.
2.  **CemPulse MQTT Backend Service:**
    *   Subscribes to relevant MQTT topics to receive data from IoT devices.
    *   Processes, validates, and potentially stores this incoming data (e.g., in a database or log files).
    *   Exposes a RESTful API for client applications to query current and historical data.
    *   May also act as an MQTT broker or forward messages to other systems.
3.  **CemPulse Web Application:**
    *   Fetches data from the CemPulse MQTT Backend Service's REST API.
    *   Renders interactive dashboards, charts, and control interfaces in a web browser.
    *   Allows users to monitor plant status, view trends, and potentially send commands back to the system (via the backend).
4.  **CemPulse Mobile Application:**
    *   Connects to the CemPulse MQTT Backend Service, potentially using both its REST API and direct MQTT subscriptions for real-time updates.
    *   Provides a streamlined, mobile-optimized view of critical data.
    *   Leverages device-specific capabilities like camera for image analysis or Bluetooth for local device interaction.

## 4. Role-Based Access Control (RBAC) and Control System

The CemPulse system implements a robust Role-Based Access Control (RBAC) system, primarily managed within the Next.js web application, to ensure secure and appropriate access to monitoring data and control functionalities.

### 4.1. Role-Based Access Control (Next.js - `cempulse`)
*   **Authentication:** The system uses a token-based authentication mechanism. Upon successful login, a JSON Web Token (JWT) named `auth_token` is issued and stored as an HTTP-only cookie. This token is crucial for subsequent authenticated requests.
*   **Authorization:** Each JWT contains claims about the authenticated user, including their `role` and an array of `allowedProcesses`. These define what a user is permitted to view and interact with.
*   **Defined Roles:** The application supports various roles, each with specific access privileges:
    *   Operations Head
    *   Plant Manager
    *   Maintenance Lead
    *   Shift Supervisor
    *   Quality Engineer
    *   Dispatch Coordinator
    *   Energy Analyst
    *   Production Engineer
    *   Safety Officer
    *   Logistics Manager
*   **Access Enforcement:**
    *   The `middleware.js` file intercepts incoming requests, verifies the `auth_token`, and redirects unauthenticated users to the login page, ensuring that only logged-in users can access protected routes.
    *   API endpoints, such as those handled by `src/app/api/genai/route.js`, perform granular authorization checks. They extract the user's `role` and `allowedProcesses` from the JWT to validate if the user has permission to access the requested industrial processes. Attempts to access unauthorized processes result in an "Unauthorized process access" error.

### 4.2. Control System

The control system aspects are integrated with the RBAC. Within the Next.js application, components like `src/components/processcards/processData.js` define `plcScada` objects that include a `controlEnabled` flag. This flag, in conjunction with the user's `allowedProcesses`, gates access to direct control actions, ensuring that only authorized personnel can initiate commands or modify process parameters.

## 5. Dashboards

CemPulse offers a comprehensive suite of dashboards across its web and mobile platforms, providing detailed insights and monitoring capabilities for various industrial processes.

### 5.1. Next.js Web Application Dashboards (`cempulse`)
The web application features several dashboards and detailed views:
*   **Main Overview Dashboard:** The primary entry point, rendered by `src/app/page.js` which utilizes `src/components/homeui/HomePage.jsx`. This dashboard provides a high-level summary of plant operations.
*   **Detailed Monitoring Dashboard:** Located at `src/app/monitor/page.jsx`, this dashboard offers in-depth monitoring capabilities. It leverages `src/app/monitor/DashboardGrid.jsx` for flexible layout and integrates `src/components/processcards/ProcessCard.jsx` components to display real-time data and controls for individual industrial processes.
*   **Process-Specific Views:** The `src/components/processcards/` directory, along with its `processData` subdirectory (e.g., `cementGrindingData.js`, `kilnOperationData.js`), contains components and data definitions for various industrial processes. Each of these can be considered a detailed view or a sub-dashboard, providing granular information and control options for specific plant areas.

### 5.2. Flutter Mobile Application Dashboards (`flutter`)
The mobile application provides a streamlined, on-the-go monitoring experience with a focus on critical information and quick interactions. It includes:
*   **Plant Overview Screen:** `lib/plant_overview_screen.dart` offers a summary view of the entire plant's status.
*   **Home Screen:** `lib/screen/home.dart` serves as the main navigation hub for the mobile application.
*   **13 Step-by-Step Process Dashboards:** The application features 13 distinct dashboards, implemented as `lib/screen/step1.dart` through `lib/screen/step13.dart`. Each of these screens is dedicated to monitoring and interacting with a specific stage or "step" within the industrial cement production process, providing focused data visualization and controls.
*   **Role-Specific Dashboards:**
    *   `lib/dashboards/plant_manager_dashboard.dart`: Tailored for plant managers, offering a consolidated view of key performance indicators and operational summaries.
    *   `lib/dashboards/worker_dashboard.dart`: Designed for plant workers, providing relevant real-time data and controls pertinent to their daily tasks.

## 6. MQTT CSV Design

The CemPulse MQTT Backend Service (`CemPulseMqtt`) logs incoming MQTT data into CSV files for historical record-keeping and analysis.

### 6.1. `mqtt_log.csv`
*   **Location:** `CemPulseMqtt/logs/mqtt_log.csv`
*   **Purpose:** Stores a comprehensive log of all MQTT messages received by the backend service.
*   **Columns:**
    *   `Timestamp`: The exact time the MQTT message was received.
    *   `ClientId`: The identifier of the client that published the MQTT message (e.g., `CemPulseFlutterClient_step10`).
    *   `Topic`: The MQTT topic to which the message was published (e.g., `cement/step10`).
    *   `Payload`: The full JSON payload of the MQTT message, containing sensor readings, process parameters, and any associated alerts.
*   **Content Example:** Payloads are JSON strings, often including structured data like silo levels, motor loads, fineness measurements, temperatures, and alerts.

### 6.2. `plant_state_log.csv`
*   **Location:** `CemPulseMqtt/logs/plant_state_log.csv`
*   **Purpose:** Records specific, critical plant state parameters at regular intervals.
*   **Columns:**
    *   `Timestamp`: The exact time the plant state was logged.
    *   `MotorTemp`: The temperature of a key motor (e.g., in Celsius).
    *   `VibrationHz`: The vibration frequency of a critical piece of equipment (e.g., in Hertz).
*   **Content Example:** Simple numerical values for motor temperature and vibration, providing a time-series record of these vital parameters.

### 6.3. Logging Mechanism
The logging functionality is managed by `CemPulseMqtt/services/LogService.cs`, which handles the writing of data to these CSV files based on incoming MQTT messages and internal state updates.

## 7. Component Breakdown

### 4.1. CemPulse Web Application (`cempulse/`)

This is the primary web-based user interface for the CemPulse system, offering a rich and interactive experience for monitoring and managing industrial processes.

*   **Purpose:** To provide comprehensive dashboards, data visualization, and administrative tools accessible via a web browser. It's designed for detailed analysis and operational oversight.
*   **Technology Stack:**
    *   **Frontend Framework:** Next.js (React 19.1.0) - A powerful React framework for building server-rendered and static web applications, offering excellent performance and developer experience.
    *   **UI Library:** Material UI (`@mui/material`, `@emotion/react`, `@emotion/styled`) - Implements Google's Material Design, providing a consistent and aesthetically pleasing set of UI components.
    *   **Styling:** Tailwind CSS (`tailwindcss`) - A utility-first CSS framework for rapidly building custom designs.
    *   **Data Visualization:** Recharts (`recharts`) - A composable charting library built with React and D3.
    *   **Animation:** Framer Motion (`framer-motion`) - A production-ready motion library for React.
    *   **Icons:** Lucide React (`lucide-react`), Material Icons (`@mui/icons-material`).
    *   **Integrations:** Google APIs (`googleapis`) - Suggests potential integration with Google Cloud services, authentication, or other Google-specific functionalities.
*   **Key Directories & Files:**
    *   `cempulse/src/app/`: Contains the main application pages and layout.
    *   `cempulse/src/components/`: Reusable UI components.
    *   `cempulse/src/services/api.js`: Likely handles API calls to the backend.
    *   `cempulse/next.config.mjs`: Next.js configuration.
    *   `cempulse/package.json`: Project dependencies and scripts.
*   **Getting Started (Development):**
    1.  Navigate to the `cempulse/` directory.
    2.  Install dependencies: `npm install` or `yarn install`
    3.  Run the development server: `npm run dev` or `yarn dev`
    4.  Open your browser to `http://localhost:3000`.
*   **[Diagram: CemPulse Web App Component Diagram]**
    *This diagram should show the internal structure of the web application, including how pages, components, services, and external APIs interact.*

### 4.2. CemPulse MQTT Backend Service (`CemPulseMqtt/`)

This service acts as the central data broker and API provider for the CemPulse ecosystem, bridging the gap between IoT devices and client applications.

*   **Purpose:** To receive, process, and manage MQTT messages from industrial sensors and devices. It provides a robust API for the web and mobile applications to consume real-time and historical data, and potentially to send commands back to devices.
*   **Technology Stack:**
    *   **Framework:** ASP.NET Core 8.0 Web Application - A high-performance, cross-platform framework for building modern, cloud-based, internet-connected applications.
    *   **MQTT Library:** MQTTnet (`MQTTnet`) - A high-performance .NET library for MQTT client and server communication, supporting MQTT versions 3.1.1 and 5.0.
    *   **API Documentation:** Swashbuckle.AspNetCore (`Swashbuckle.AspNetCore`) - Generates OpenAPI (Swagger) specifications for the API, providing interactive documentation and client generation capabilities.
    *   **Logging:** Likely uses built-in .NET Core logging, potentially configured for file-based logging (indicated by `logs/` directory).
*   **Key Directories & Files:**
    *   `CemPulseMqtt/Program.cs`: Application entry point and service configuration.
    *   `CemPulseMqtt/Api/`: Contains API controllers (e.g., `MqttDataController.cs`, `PlantController.cs`, `ProcessApprovalController.cs`).
    *   `CemPulseMqtt/services/`: Contains core business logic and service implementations (e.g., `MqttServerService.cs`, `MqttDataStore.cs`, `LogService.cs`).
    *   `CemPulseMqtt/appsettings.json`: Application configuration.
    *   `CemPulseMqtt/CemPulseMqtt.csproj`: Project file defining dependencies and target framework.
    *   `CemPulseMqtt/logs/`: Directory for application logs (e.g., `mqtt_log.csv`, `plant_state_log.csv`).
*   **Getting Started (Development):**
    1.  **Prerequisites:** .NET SDK 8.0.
    2.  Navigate to the `CemPulseMqtt/` directory.
    3.  Restore dependencies: `dotnet restore`
    4.  Build the project: `dotnet build`
    5.  Run the application: `dotnet run`
    6.  The API documentation will typically be available at `http://localhost:<port>/swagger` (check `launchSettings.json` for the exact port).
*   **[Diagram: CemPulse MQTT Backend Service Component Diagram]**
    *This diagram should detail the internal components of the backend, showing how MQTT messages are received, processed by services, stored, and exposed via API controllers.*

### 4.3. CemPulse Mobile Application (`flutter/`)

The mobile application provides a portable and intuitive interface for monitoring industrial processes, optimized for on-the-go access.

*   **Purpose:** To offer real-time data visualization, alerts, and interactive controls on mobile devices. It's designed for quick insights and immediate interaction with the industrial environment.
*   **Technology Stack:**
    *   **Framework:** Flutter - Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.
    *   **UI/Data Visualization:**
        *   `fl_chart`: A highly customizable Flutter chart library.
        *   `syncfusion_flutter_charts`, `syncfusion_flutter_gauges`: Comprehensive charting and gauge widgets for rich data visualization.
        *   `percent_indicator`: Widgets to show percentage in a circular or linear indicator.
    *   **Connectivity:**
        *   `mqtt_client`: A Dart MQTT client for connecting to MQTT brokers.
        *   `flutter_reactive_ble`: A reactive Bluetooth Low Energy (BLE) plugin for Flutter.
        *   `http`: A composable, multi-platform, Future-based API for HTTP requests.
    *   **Image Processing/ML:**
        *   `google_mlkit_image_labeling`: Integrates Google's ML Kit for on-device image labeling.
        *   `image_picker`: Provides a way to pick images from the device's gallery or camera.
    *   **State Management:** Provider (`provider`) - A simple yet powerful state management solution for Flutter.
    *   **UI Enhancements:** `cupertino_icons`, `flutter_animate`.
    *   **Assets:** `Cem-Pulse-Logo.PNG`, `plant_data.json`.
*   **Key Directories & Files:**
    *   `flutter/lib/main.dart`: Application entry point.
    *   `flutter/lib/screens/`: Contains different screens/pages of the app.
    *   `flutter/lib/components/`: Reusable UI widgets.
    *   `flutter/lib/mqtt/`: MQTT-related logic.
    *   `flutter/lib/services/`: Services for data fetching, etc.
    *   `flutter/assets/`: Static assets like images and data files.
    *   `flutter/pubspec.yaml`: Project dependencies and metadata.
*   **Getting Started (Development):**
    1.  **Prerequisites:** Flutter SDK installed and configured.
    2.  Navigate to the `flutter/` directory.
    3.  Get dependencies: `flutter pub get`
    4.  Ensure you have a device or emulator running.
    ```bash
    flutter devices
    ```
5.  Run the application: `flutter run`
    The application will launch on your selected device/emulator.

## 5. Prerequisites

To set up and run the entire CemPulse project, you will need the following installed on your development machine:

*   **Git:** For cloning the repository.
*   **Node.js & npm/yarn:** Required for the Next.js web application.
    *   Node.js (LTS version recommended)
    *   npm (comes with Node.js) or Yarn
*   **.NET SDK 8.0:** Required for the ASP.NET Core backend service.
*   **Flutter SDK:** Required for the Flutter mobile application.
    *   Ensure Flutter is correctly set up for your target platforms (Android Studio/Xcode for mobile development).
*   **An MQTT Broker:** While the `CemPulseMqtt` service can potentially act as a broker, for a full setup, you might need an external MQTT broker (e.g., Mosquitto, HiveMQ, or a cloud-based service) for IoT devices to publish to.

## 6. Getting Started

Follow these steps to get the CemPulse project up and running locally.

### 6.1. Clone the Repository

```bash
git clone https://github.com/your-username/CemPulse.git # Replace with actual repo URL
cd CemPulse
```

### 6.2. Setup CemPulse MQTT Backend Service

1.  Navigate to the backend directory:
    ```bash
    cd CemPulseMqtt
    ```
2.  Restore .NET dependencies:
    ```bash
    dotnet restore
    ```
3.  Build the project:
    ```bash
    dotnet build
    ```
4.  Run the service:
    ```bash
    dotnet run
    ```
    The service will typically start on `http://localhost:5000` or `http://localhost:5001` (HTTPS). Check the console output for the exact URL. The Swagger UI will be available at `/swagger`.

### 6.3. Setup CemPulse Web Application

1.  Open a new terminal and navigate to the web application directory:
    ```bash
    cd cempulse
    ```
2.  Install Node.js dependencies:
    ```bash
    npm install # or yarn install
    ```
3.  Run the development server:
    ```bash
    npm run dev # or yarn dev
    ```
    The web application will be accessible at `http://localhost:3000`.

### 6.4. Setup CemPulse Mobile Application

1.  Open a new terminal and navigate to the mobile application directory:
    ```bash
    cd flutter
    ```
2.  Get Flutter dependencies:
    ```bash
    flutter pub get
    ```
3.  Ensure you have a device or emulator running.
    ```bash
    flutter devices
    ```
4.  Run the application: `flutter run`
    The application will launch on your selected device/emulator.

## 7. Contributing

We welcome contributions to the CemPulse project! Please refer to the individual `README.md` files within each component's directory (`cempulse/README.md`, `CemPulseMqtt/README.md`, `flutter/README.md`) for specific guidelines on contributing to that particular part of the project.

## 8. License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file located in the root of this repository.

## 9. Troubleshooting

*   **Port Conflicts:** If a service fails to start due to a port conflict, you can either change the port in the respective configuration files (e.g., `launchSettings.json` for .NET, `next.config.mjs` for Next.js) or stop the process currently using that port.
*   **Dependency Issues:** Ensure all prerequisites are installed and that you've run the respective dependency installation commands (`npm install`, `dotnet restore`, `flutter pub get`) in each component's directory.
*   **MQTT Connectivity:** Verify that your MQTT broker is running and accessible. Check firewall settings if connecting to an external broker.
*   **API Connectivity:** Ensure the `CemPulseMqtt` backend service is running before starting the web or mobile applications, as they depend on its API.

## 10. Future Enhancements

Potential areas for future development include:

*   **Database Integration:** Implement persistent storage for MQTT data (e.g., PostgreSQL, MongoDB) for advanced analytics and historical reporting.
*   **Authentication & Authorization:** Secure API endpoints and application access for multi-user environments.
*   **Real-time Command & Control:** Extend the system to send commands from web/mobile apps back to IoT devices via MQTT.
*   **Advanced Analytics:** Integrate with data analytics platforms for deeper insights into industrial processes.
*   **Containerization:** Provide Dockerfiles and Docker Compose configurations for easier deployment and environment consistency.
*   **CI/CD Pipelines:** Set up continuous integration and deployment for automated testing and releases.
