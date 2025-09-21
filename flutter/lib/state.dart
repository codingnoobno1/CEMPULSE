// lib/state.dart
import 'package:flutter/material.dart';

/// Stage information model
class StageInfo {
  final String title;
  final String shortDesc;
  final String? imageUrl; // optional, can be null

  StageInfo(
    this.title,
    this.shortDesc, {
    this.imageUrl,
  });
}
