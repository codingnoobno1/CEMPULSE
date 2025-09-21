import 'package:flutter/material.dart';
import 'screen/home.dart';

void main() {
  runApp(const CemPulseApp());
}

class CemPulseApp extends StatelessWidget {
  const CemPulseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CemPulse',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.indigo,
        scaffoldBackgroundColor: const Color(0xFFF7F7F7),
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const MainDashboard(),
    );
  }
}
