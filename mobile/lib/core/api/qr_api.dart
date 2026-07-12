import 'dart:convert';
import '../models/qr_location.dart';
import 'api_client.dart';

class QrApi {
  static Future<QrLocation> resolveQrCode(String qrCode) async {
    try {
      final response = await ApiClient.post(
        '/api/qr/resolve',
        body: {'qr_code': qrCode},
      );
      final data = json.decode(response.body);
      return QrLocation.fromJson(data);
    } catch (e) {
      rethrow;
    }
  }
}
